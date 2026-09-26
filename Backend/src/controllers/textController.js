import QRCode from "qrcode";
import Transfer from "../models/Transfer.js";
import { createTextTransfer, publicUrl } from "../services/transferService.js";

export async function createText(req, res, next) {
  try { const text = typeof req.body.text === "string" ? req.body.text : ""; if (!text.trim()) return res.status(400).json({ error: "Text is required" }); const transfer = await createTextTransfer(text); return res.status(201).json({ code: transfer.code, qrCode: await QRCode.toDataURL(publicUrl(transfer.code)), url: publicUrl(transfer.code), expiresAt: transfer.expiresAt }); } catch (error) { next(error); }
}
export async function getText(req, res, next) {
  try { const transfer = await Transfer.findOne({ code: req.params.code, type: "text", expiresAt: { $gt: new Date() } }); if (!transfer) return res.status(404).json({ error: "Code not found or expired" }); return res.json({ code: transfer.code, text: transfer.text, expiresAt: transfer.expiresAt }); } catch (error) { next(error); }
}