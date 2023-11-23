import { Router } from "express";
import { mockingProducts } from "../controllers/mockingController.js";

const router = Router();

router.get("/", mockingProducts);

export default router;
