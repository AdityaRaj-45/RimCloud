import { Router } from "express";
import { getTransfer, downloadFile } from "../controllers/transferController.js";
const router = Router();
router.get("/:code", getTransfer);
router.get("/:code/files/:fileId/download", downloadFile);
export default router;