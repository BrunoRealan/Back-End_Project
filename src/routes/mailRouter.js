import { Router } from "express";
import { sendMail } from "../controllers/mailController.js";

const router = Router();

router.get("/", sendMail);
export default router;
