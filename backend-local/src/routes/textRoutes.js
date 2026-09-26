import { Router } from "express";
import { createText, getText } from "../controllers/textController.js";
const router = Router();
router.post("/", createText);
router.get("/:code", getText);
export default router;