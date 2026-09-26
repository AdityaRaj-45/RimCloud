import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { uploadFile, sendFileEmail } from "../controllers/fileController.js";
const router = Router();
router.post("/", upload.single("file"), uploadFile);
router.post("/send", sendFileEmail);
export default router;