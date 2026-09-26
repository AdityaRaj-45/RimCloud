import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";
import { env } from "../config/env.js";

const storageDir = path.resolve(env.storageDir);
fs.mkdirSync(storageDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, storageDir),
  filename: (_req, file, callback) => callback(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`),
});
export const upload = multer({ storage, limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 } });