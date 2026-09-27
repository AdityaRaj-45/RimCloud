import fs from "node:fs";
import Transfer from "../models/Transfer.js";
import { serialize } from "../services/transferService.js";

function escapeHtml(value) {
  return String(value).replace(/[&<>\'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;",
  })[character]);
}

function renderFilePage(transfer, file) {
  const downloadUrl = `/api/transfers/${encodeURIComponent(transfer.code)}/files/${file._id}/download`;
  const name = escapeHtml(file.originalName);
  const mimeType = file.mimeType || "application/octet-stream";
  const preview = mimeType.startsWith("image/")
    ? `<img src="${downloadUrl}?inline=1" alt="${name}">`
    : mimeType.startsWith("video/")
      ? `<video controls playsinline preload="metadata" src="${downloadUrl}?inline=1"></video>`
      : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${name} - RimCloud</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #090b0e; color: #f4f5f7; font: 15px system-ui, sans-serif; }
    .shell { width: min(760px, 100%); padding: 28px; border: 1px solid #2a2e36; border-radius: 16px; background: #14171b; box-shadow: 0 24px 70px #0008; }
    .eyebrow { margin: 0 0 18px; color: #8e98a8; font-size: 11px; letter-spacing: .16em; }
    h1 { margin: 0; font-size: clamp(20px, 4vw, 30px); overflow-wrap: anywhere; }
    .meta { margin: 8px 0 18px; color: #8e98a8; overflow-wrap: anywhere; }
    .preview { margin-bottom: 16px; overflow: hidden; border: 1px solid #30353e; border-radius: 10px; background: #090b0e; }
    img, video { display: block; width: 100%; max-height: 68vh; object-fit: contain; background: #090b0e; }
    .file-row { margin-bottom: 16px; padding: 15px; border: 1px solid #30353e; border-radius: 10px; overflow-wrap: anywhere; }
    .download { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 46px; padding: 11px 17px; border-radius: 8px; background: #e9edf4; color: #10151e; text-decoration: none; font-weight: 700; }
    .download:hover { background: #fff; }
    @media (max-width: 560px) { body { padding: 14px; } .shell { padding: 18px; } }
  </style>
</head>
<body>
  <main class="shell">
    <p class="eyebrow">RIMCLOUD · FILE TRANSFER</p>
    <h1>${name}</h1>
    <p class="meta">${escapeHtml(mimeType)} · ${file.size} bytes</p>
    ${preview ? `<div class="preview">${preview}</div>` : `<div class="file-row">${name}</div>`}
    <a class="download" href="${downloadUrl}" download>Download file</a>
  </main>
</body>
</html>`;
}

export async function getTransfer(req, res, next) {
  try {
    const transfer = await Transfer.findOne({ code: req.params.code, expiresAt: { $gt: new Date() } });
    if (!transfer) return res.status(404).json({ error: "Invalid or expired access code" });
    const acceptsHtml = req.get("accept")?.includes("text/html");
    if (acceptsHtml && transfer.type === "file" && transfer.files[0]) return res.type("html").send(renderFilePage(transfer, transfer.files[0]));
    return res.json({ ...serialize(transfer), text: transfer.type === "text" ? transfer.text : undefined });
  } catch (error) { next(error); }
}
export async function downloadFile(req, res, next) {
  try {
    const transfer = await Transfer.findOne({ code: req.params.code, expiresAt: { $gt: new Date() } });
    const file = transfer?.files.id(req.params.fileId);
    if (!file) return res.status(404).json({ error: "File not found or transfer expired" });
    file.downloads += 1;
    await transfer.save();
    if (req.query.inline === "1" && (file.mimeType?.startsWith("image/") || file.mimeType?.startsWith("video/"))) {
      res.type(file.mimeType);
      res.setHeader("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(file.originalName)}`);
      return res.sendFile(file.path, (error) => { if (error && !res.headersSent) next(error); });
    }
    return res.download(file.path, file.originalName, (error) => { if (error && !res.headersSent) next(error); });
  } catch (error) { next(error); }
}