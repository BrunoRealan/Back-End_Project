import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
  try {
    await productManager.createCart();
    res.status(200).send({ message: "Cart created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while creating the cart" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid, 10);
    if (isNaN(cartId) || cartId < 0) {
      return res.status(400).send({ error: "Invalid cart ID" });
    }

    const cart = await productManager.getCartById(cartId);
    res.status(200).send(cart);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching the cart" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);

    if (isNaN(cartId) || cartId < 0 || isNaN(productId) || productId < 0) {
      return res.status(400).send({ error: "Invalid cart ID or product ID" });
    }

    await productManager.addToCart(cartId, productId);
    res.status(200).send({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        error: "An error occurred while adding the product to the cart",
      });
  }
});

export default router;
