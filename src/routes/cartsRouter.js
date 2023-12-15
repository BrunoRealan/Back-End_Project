import { Router } from "express";
import {
  addToCart,
  createCart,
  deleteAllProductsInCart,
  deleteProductInCart,
  getCartById,
  getCarts,
  modifyQuantityInCart,
  updateCartById,
  purchase,
} from "../controllers/cartController.js";
import userRoutes from "../middlewares/userRoutes.js";
import adminRoutes from "../middlewares/adminRoutes.js";

const router = Router();

router.get("/", adminRoutes, getCarts);
router.post("/", createCart);
router.get("/:cId", getCartById);
router.put("/:cId", updateCartById);
router.delete("/:cId", deleteAllProductsInCart);
router.post("/:cId/products/:pId", userRoutes, addToCart);
router.put("/:cId/products/:pId", modifyQuantityInCart);
router.delete("/:cId/products/:pId", deleteProductInCart);
//CAMBIAR METODO A POST
router.get("/:cId/purchase", purchase);

export default router;
