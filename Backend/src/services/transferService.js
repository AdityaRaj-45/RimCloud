import fs from "node:fs/promises";
import path from "node:path";
import Transfer from "../models/Transfer.js";
import { env } from "../config/env.js";
import { generateCode } from "../utils/code.js";

export async function uniqueCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = generateCode();
    if (!(await Transfer.exists({ code }))) return code;
  }

  throw new Error("Could not generate a unique access code");
}

function expiry() { return new Date(Date.now() + env.ttlHours * 60 * 60 * 1000); }
export async function createFileTransfer(files) {
  return Transfer.create({
    code: await uniqueCode(),
    type: "file",
    expiresAt: expiry(),

    files: files.map((file) => ({
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype || "application/octet-stream",
      size: file.size,
      path: file.path,
    })),
  });
}

export async function createTextTransfer(text) {
  return Transfer.create({ code: await uniqueCode(), type: "text", text, expiresAt: expiry() });
}

export function publicUrl(code) { return `${env.apiUrl}/api/transfers/${encodeURIComponent(code)}`; }

export function serialize(transfer) {
  return {
    code: transfer.code,
    type: transfer.type,
    expiresAt: transfer.expiresAt,
    files: transfer.files.map((file) => ({
      id: file._id.toString(),
      name: file.originalName,
      size: file.size,
      mimeType: file.mimeType,
      downloads: file.downloads,
      downloadUrl: `${env.apiUrl}/api/transfers/${encodeURIComponent(transfer.code)}/files/${file._id}/download`,
    })),
  };
}

export async function cleanupExpired() {
  const expired = await Transfer.find({ expiresAt: { $lte: new Date() } }).lean();
  const promises = expired.map(async (transfer) => {
    for (const file of transfer.files) {
      try {
        await fs.unlink(path.resolve(file.path));
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
    await Transfer.deleteOne({ _id: transfer._id });
  });
  await Promise.all(promises);
  if (expired.length) console.log(`Cleaned ${expired.length} expired transfer(s)`);
}