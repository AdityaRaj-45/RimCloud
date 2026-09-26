export function notFound(_req, res) { res.status(404).json({ error: "Route not found" }); }
export function errorHandler(error, _req, res, _next) {
  console.error(error);
  if (error.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: `File is too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 100} MB.` });
  res.status(error.status || 500).json({ error: error.message || "Internal server error" });
}