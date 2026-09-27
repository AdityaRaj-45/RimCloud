import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),

  origins: (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((value) => value.trim()),

  apiUrl: (process.env.PUBLIC_API_URL || "http://localhost:5000")
    .replace(/\/$/, ""),

  ttlHours: Number(process.env.TRANSFER_TTL_HOURS || 24),

  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 100),

  storageDir: process.env.STORAGE_DIR || "./storage",
};