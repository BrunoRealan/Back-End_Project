import { Router } from "express";
import {
  getCartById,
  getProducts,
  getProductsLogged,
} from "../controllers/viewController.js";
import publicRoutes from "../middleware/publicRoutes.js";
import privateRoutes from "../middleware/privateRoutes.js";

const router = Router();

router.get("/", getProducts);

router.get("/products", getProductsLogged);

router.get("/cart/:cId", getCartById);

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {});
});

router.get("/chat", async (req, res) => {
  res.render("chat", {});
});

router.get("/signup", publicRoutes, async (req, res) => {
  res.render("signup");
});

router.get("/login", publicRoutes, async (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

router.get("/failregister", (req, res) => {
  res.send("Fallo de registro");
});

router.get("/profile", privateRoutes, async (req, res) => {
  const { first_name, last_name, email, age, role, cart } = req.session;
  res.render("profile", { first_name, last_name, email, age, role, cart });
});

export default router;
