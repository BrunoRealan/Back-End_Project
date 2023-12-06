import { Router } from "express";
import { sendMail, sendResetMail } from "../controllers/mailController.js";

const router = Router();

router.get("/", sendMail);
router.post("/resetPassword",sendResetMail)
export default router;
