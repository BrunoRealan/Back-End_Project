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
  sendResetPassword,
  resetPassword,
  admin,
} from "../controllers/viewController.js";
import publicRoutes from "../middlewares/publicRoutes.js";
import privateRoutes from "../middlewares/privateRoutes.js";
import userRoutes from "../middlewares/userRoutes.js";
import logger from "../services/logger.js";

const router = Router();

router.get("/test-error", async (req, res, next) => {
  try {
    // Código que puede lanzar un error asincrónico
    throw new Error("Este es un error de prueba");
  } catch (error) {
    logger.error(error.message);
    next(error); // Pasa el error al siguiente middleware (asyncErrorHandler)
  }
});
router.get("/", getProducts);
router.get("/products", getProductsLogged);
router.get("/cart/:cId", getCartById);
router.get("/realtimeproducts", userRoutes, realTimeProducts);
router.get("/chat", userRoutes, chat);
router.get("/signup", publicRoutes, signup);
router.get("/login", publicRoutes, login);
router.post("/logout", logout);
router.get("/sendResetPassword", sendResetPassword);
router.get("/resetPassword/:rId", resetPassword);
router.get("/failregister", failregister);
router.get("/profile", privateRoutes, profile);
router.get("/admin", admin);


export default router;
