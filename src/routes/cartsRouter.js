import { Router } from "express";
import {
  addToCart,
  createCart,
  deleteCart,
  deleteProductCart,
  getCartById,
  getCarts,
  modifyQuantityInCart,
  updateCart,
} from "../controllers/cartControllers.js";

const router = Router();

router.post("/", createCart);
router.get("/", getCarts);
router.get("/:cId", getCartById);
router.post("/:cId/products/:pId", addToCart);
router.put("/:cId", updateCart);
router.put("/:cId/products/:pId", modifyQuantityInCart);
router.delete("/:cId/products/:pId", deleteProductCart);
router.delete("/:cId", deleteCart);

export default router;
