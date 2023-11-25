import { Router } from "express";
import { loggerTestController } from "../controllers/loggerTestController.js";

const router = Router();

router.get("/", loggerTestController);

export default router;
