export function notFound(_req, res) { res.status(404).json({ error: "Route not found" }); }
export function errorHandler(error, _req, res, _next) {
  console.error(error);
  if (error.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: `File is too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 100} MB.` });
  if (error.code === "LIMIT_FILE_COUNT") return res.status(400).json({ error: "A transfer can contain at most 100 files." });
  if (error.code === "LIMIT_UNEXPECTED_FILE") return res.status(400).json({ error: "Use the 'files' field and upload no more than 100 files." });
  res.status(error.status || 500).json({ error: error.message || "Internal server error" });
}