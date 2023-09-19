import { Router } from "express";
import ProductManager from "../dao/database/ProductManager.js";
const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
      return res.status(200).send(products.slice(0, limit));
    }
    res.status(200).send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.get("/:pid", async (req, res) => {
  try {
    //const productId = parseInt(req.params.pid, 10);
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    if (product === undefined) {
      return res.status(400).send();
    }
    res.status(200).send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.post("/", async (req, res) => {
  try {
    await productManager.addProduct(req.body);
    const products = await productManager.getProducts();
    req.context.socketServer.emit("updateProducts", products);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.put("/:pid", async (req, res) => {
  try {
    //const productId = parseInt(req.params.pid, 10);
    const productId = req.params.pid;
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    const productFound = await productManager.getProductById(productId);
    if (productFound === undefined) {
      return res.status(400).send();
    }
    await productManager.updateProduct(
      productId,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    );
    const products = await productManager.getProducts();
    req.context.socketServer.emit("updateProducts", products);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    //const productId = parseInt(req.params.pid, 10);
    const productId = req.params.pid;
    const productFound = await productManager.getProductById(productId);
    if (productFound === undefined) {
      res.status(400).send();
    }
    await productManager.deleteProduct(productId);
    const products = await productManager.getProducts();
    req.context.socketServer.emit("updateProducts", products);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

export default router;