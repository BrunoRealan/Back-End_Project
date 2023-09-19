import { Router } from "express";
//import ProductManager from "../dao/filesystem/ProductManager.js";
import CartManager from "../dao/database/CartManager.js";
const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    await cartManager.createCart();
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).send(carts);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.get("/:cid", async (req, res) => {
  try {
    /*const cartId = parseInt(req.params.cid, 10);
         if (isNaN(cartId) || cartId < 0) {
      return res.status(400).send();
    }
    */
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    res.status(200).send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    //const cartId = parseInt(req.params.cid, 10);
    //const productId = parseInt(req.params.pid, 10);
    const cartId = req.params.cid;
    const productId = req.params.pid;

    /*     if (isNaN(cartId) || cartId < 0 || isNaN(productId) || productId < 0) {
      return res.status(400).send();
    } */

    await cartManager.addToCart(cartId, productId);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    //const cartId = parseInt(req.params.pid, 10);
    const cartId = req.params.cid;
    const cartFound = await cartManager.getCartById(cartId);
    if (cartFound === undefined) {
      res.status(400).send();
    }
    cartManager.deleteProduct(cartId);
    const carts = await cartManager.getCarts();
    req.context.socketServer.emit("updateProducts", carts);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

export default router;
