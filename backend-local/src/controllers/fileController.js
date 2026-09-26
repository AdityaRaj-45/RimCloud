import Transfer from "../models/Transfer.js";
import QRCode from "qrcode";
import { createFileTransfer, publicUrl, serialize } from "../services/transferService.js";

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file was uploaded" });
    const transfer = await createFileTransfer(req.file);
    return res.status(201).json({ code: transfer.code, qrCode: await QRCode.toDataURL(publicUrl(transfer.code)), file: publicUrl(transfer.code), url: publicUrl(transfer.code), expiresAt: transfer.expiresAt, files: serialize(transfer).files });
  } catch (error) { next(error); }
}
export async function sendFileEmail(_req, res) { res.status(410).json({ error: "Email sharing is disabled" }); }