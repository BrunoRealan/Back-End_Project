import { Router } from "express";
import {
  addToCart,
  createCart,
  deleteInCart,
  deleteProductInCart,
  getCartById,
  getCarts,
  modifyQuantityInCart,
  updateCart,
  purchase,
} from "../controllers/cartController.js";
import userRoutes from "../middlewares/userRoutes.js";
import adminRoutes from "../middlewares/adminRoutes.js";

const router = Router();

router.post("/", createCart);
router.get("/", adminRoutes, getCarts);
router.get("/:cId", getCartById);
router.post("/:cId/products/:pId", userRoutes, addToCart);
router.put("/:cId", updateCart);
router.put("/:cId/products/:pId", modifyQuantityInCart);
router.delete("/:cId/products/:pId", deleteProductInCart);
router.delete("/:cId", deleteInCart);
//CAMBIAR METODO A POST
router.get("/:cId/purchase", purchase);

export default router;
