import { Router } from "express";
import {
  createCart,
  getCartById,
  updateCartById,
  deleteAllProductsInCart,
  addToCart,
  modifyQuantityInCart,
  deleteProductInCart,
  purchase,
} from "../controllers/cartController.js";
import userRoutes from "../middlewares/userRoutes.js";

const router = Router();

router.post("/", createCart);
router.get("/:cId", getCartById);
router.put("/:cId", updateCartById);
router.delete("/:cId", deleteAllProductsInCart);
router.post("/:cId/products/:pId", userRoutes, addToCart);
router.put("/:cId/products/:pId", modifyQuantityInCart);
router.delete("/:cId/products/:pId", deleteProductInCart);
router.post("/:cId/purchase", /* userRoutes, */ purchase);

export default router;
