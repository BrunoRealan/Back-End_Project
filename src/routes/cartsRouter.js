import { Router } from "express";
import ProductManager from "../ProductManager.js";
const router = Router();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
  try {
    await productManager.createCart();
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid, 10);
    if (isNaN(cartId) || cartId < 0) {
      return res.status(400).send();
    }

    const cart = await productManager.getCartById(cartId);
    res.status(200).send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);

    if (isNaN(cartId) || cartId < 0 || isNaN(productId) || productId < 0) {
      return res.status(400).send();
    }

    await productManager.addToCart(cartId, productId);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

export default router;
