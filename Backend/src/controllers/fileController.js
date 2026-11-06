import crypto from "node:crypto";
import path from "node:path";
import QRCode from "qrcode";
import Transfer from "../models/Transfer.js";
import { env } from "../config/env.js";
import {
  createUploadUrl,
  getObjectInfo,
  deleteS3Objects,
} from "../services/s3Service.js";
import {
  uniqueCode,
  createFileTransfer,
  publicUrl,
  serialize,
} from "../services/transferService.js";

const MAX_BYTES = env.maxFileSizeMb * 1024 * 1024; // 100 MB per file
const MAX_TOTAL_BYTES = (env.maxTotalSizeMb || 500) * 1024 * 1024; // 500 MB aggregate

// Part A: Validate metadata, create pending MongoDB record, and return Presigned URLs
export async function getUploadUrls(req, res, next) {
  try {
    const { files } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    if (files.length > 100) {
      return res.status(400).json({ error: "Maximum 100 files allowed per transfer" });
    }

    let totalSize = 0;

    for (const file of files) {
      if (!file.name || typeof file.size !== "number" || !file.mimeType) {
        return res.status(400).json({ error: "Invalid file metadata" });
      }

      if (file.size <= 0) {
        return res.status(400).json({ error: `Invalid size for file: ${file.name}` });
      }

      if (file.size > MAX_BYTES) {
        return res.status(400).json({
          error: `File "${file.name}" exceeds the ${env.maxFileSizeMb} MB limit.`,
        });
      }

      totalSize += file.size;
    }

    if (totalSize > MAX_TOTAL_BYTES) {
      return res.status(400).json({
        error: `Total transfer size exceeds ${env.maxTotalSizeMb || 500} MB limit.`,
      });
    }

    const code = await uniqueCode();
    const uploads = [];

    for (const file of files) {
      const ext = path.extname(file.name).slice(0, 20);
      const s3Key = `uploads/${code}/${crypto.randomUUID()}${ext}`;
      const uploadUrl = await createUploadUrl(s3Key, file.mimeType);

      uploads.push({
        originalName: file.name,
        size: file.size,
        mimeType: file.mimeType,
        s3Key,
        uploadUrl,
      });
    }

    // Persist pending metadata in MongoDB so the server owns the source of truth
    await createFileTransfer(code, uploads);

    return res.status(201).json({
      code,
      uploads,
    });
  } catch (error) {
    next(error);
  }
}

// Part B: Verify actual S3 objects using HeadObject, activate transfer, and return QR/link payload
export async function completeUpload(req, res, next) {
  try {
    const { code } = req.params;
    const transfer = await Transfer.findOne({ code });

    if (!transfer) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    // Idempotency: If client retries after completion, return the existing active transfer
    if (transfer.status === "active") {
      const shareUrl = publicUrl(transfer.code);
      return res.json({
        code: transfer.code,
        qrCode: await QRCode.toDataURL(shareUrl),
        file: shareUrl,
        url: shareUrl,
        expiresAt: transfer.expiresAt,
        files: serialize(transfer).files,
      });
    }

    // Confirm every expected object actually arrived in S3 with the exact declared size
    for (const file of transfer.files) {
      try {
        const objectInfo = await getObjectInfo(file.s3Key);

        if (objectInfo.ContentLength !== file.size) {
          throw new Error(`Size mismatch for ${file.originalName}`);
        }
      } catch (err) {
        // Verification failed: cleanup uploaded objects and wipe pending record
        const keys = transfer.files.map((f) => f.s3Key);
        await deleteS3Objects(keys).catch(() => {});
        await Transfer.deleteOne({ _id: transfer._id });

        return res.status(400).json({
          error: `Upload verification failed for "${file.originalName}". Transfer cancelled.`,
        });
      }
    }

    // Activate the transfer and start the official 1-hour expiration countdown
    transfer.status = "active";
    transfer.expiresAt = new Date(Date.now() + env.ttlHours * 60 * 60 * 1000);
    await transfer.save();

    const shareUrl = publicUrl(transfer.code);

    return res.json({
      code: transfer.code,
      qrCode: await QRCode.toDataURL(shareUrl),
      file: shareUrl,
      url: shareUrl,
      expiresAt: transfer.expiresAt,
      files: serialize(transfer).files,
    });
  } catch (error) {
    next(error);
  }
}

export async function sendFileEmail(_req, res) {
  return res.status(410).json({ error: "Email sharing is disabled" });
}