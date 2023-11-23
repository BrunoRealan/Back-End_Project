import { Router } from "express";
import {
  getCartById,
  getProducts,
  getProductsLogged,
  realTimeProducts,
  chat,
  signup,
  login,
  logout,
  failregister,
  profile,
} from "../controllers/viewController.js";
import publicRoutes from "../middlewares/publicRoutes.js";
import privateRoutes from "../middlewares/privateRoutes.js";
import userRoutes from "../middlewares/userRoutes.js";

const router = Router();

router.get("/test-error", (req, res) => {
  throw new Error("Este es un error de prueba");
});
router.get("/", getProducts);
router.get("/products", getProductsLogged);
router.get("/cart/:cId", getCartById);
router.get("/realtimeproducts", userRoutes, realTimeProducts);
router.get("/chat", userRoutes, chat);
router.get("/signup", publicRoutes, signup);
router.get("/login", publicRoutes, login);
router.get("/logout", logout);
router.get("/failregister", failregister);
router.get("/profile", privateRoutes, profile);

export default router;
