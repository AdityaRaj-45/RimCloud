import { Router } from "express";
import {
  getUploadUrls,
  completeUpload,
  sendFileEmail,
} from "../controllers/fileController.js";
const router = Router();
router.post("/presign", getUploadUrls);
router.post("/:code/complete", completeUpload);
router.post("/send", sendFileEmail);

export default router;