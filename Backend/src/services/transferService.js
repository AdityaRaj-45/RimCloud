import Transfer from "../models/Transfer.js";
import { env } from "../config/env.js";
import { generateCode } from "../utils/code.js";
import { deleteS3Objects } from "./s3Service.js";

export async function uniqueCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = generateCode();
    if (!(await Transfer.exists({ code }))) return code;
  }

  throw new Error("Could not generate a unique access code");
}

function expiry() {
  return new Date(Date.now() + env.ttlHours * 60 * 60 * 1000);
}

export async function createFileTransfer(code, uploads) {
  return Transfer.create({
    code,
    type: "file",
    status: "pending",
    expiresAt: expiry(),
    files: uploads.map((file) => ({
      originalName: file.originalName,
      s3Key: file.s3Key,
      mimeType: file.mimeType || "application/octet-stream",
      size: file.size,
      downloads: 0,
    })),
  });
}

export async function createTextTransfer(text) {
  return Transfer.create({
    code: await uniqueCode(),
    type: "text",
    status: "active",
    text,
    expiresAt: expiry(),
  });
}

export function publicUrl(code) {
  return `${env.apiUrl}/api/transfers/${encodeURIComponent(code)}`;
}

export function serialize(transfer) {
  return {
    code: transfer.code,
    type: transfer.type,
    status: transfer.status,
    text: transfer.text,
    expiresAt: transfer.expiresAt,
    files: (transfer.files || []).map((file) => ({
      id: file._id.toString(),
      name: file.originalName,
      originalName: file.originalName,
      size: file.size,
      mimeType: file.mimeType,
      downloads: file.downloads,
      downloadUrl: `${env.apiUrl}/api/transfers/${encodeURIComponent(transfer.code)}/files/${file._id}/download`,
    })),
  };
}

export async function cleanupExpired() {
  const expiredTransfers = await Transfer.find({
    expiresAt: { $lte: new Date() },
  });

  for (const transfer of expiredTransfers) {
    const keys = (transfer.files || [])
      .map((file) => file.s3Key)
      .filter(Boolean);

    if (keys.length > 0) {
      try {
        await deleteS3Objects(keys);
      } catch (error) {
        console.error(`Failed to delete S3 objects for ${transfer.code}:`, error);
      }
    }

    await Transfer.deleteOne({ _id: transfer._id });
  }

  if (expiredTransfers.length) {
    console.log(`Cleaned ${expiredTransfers.length} expired transfer(s)`);
  }
}