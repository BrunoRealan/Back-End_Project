import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import adminRoutes from "../middlewares/adminRoutes.js";

const router = Router();

router.get("/", getProducts);
router.post("/", adminRoutes, addProduct);
router.get("/:pid", getProductById);
router.put("/:pid", adminRoutes, updateProduct);
router.delete("/:pid", adminRoutes, deleteProduct);

export default router;
