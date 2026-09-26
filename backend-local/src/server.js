import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { cleanupExpired } from "./services/transferService.js";

await connectDB();
app.listen(env.port, "0.0.0.0", () => console.log(`Local backend listening on port ${env.port}`));
setInterval(() => cleanupExpired().catch((error) => console.error("Cleanup failed:", error.message)), 60 * 1000).unref();
cleanupExpired().catch((error) => console.error("Initial cleanup failed:", error.message));