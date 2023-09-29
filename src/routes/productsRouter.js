import { Router } from "express";
import ProductManager from "../dao/database/ProductManager.js";
import { productModel } from "../dao/models/product.model.js";
const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit, query, sort, page } = req.query;
    const sortObjectMapper = {
      asc: { price: 1 },
      desc: { price: -1 },
    };

    const modelQuery = query ? JSON.parse(query) : {};
    const modelLimit = limit ? parseInt(limit, 10) : 10;
    const modelPage = page ? parseInt(page, 10) : 1;
    const modelSort = sortObjectMapper[sort] ?? undefined;

    const products = await productModel.paginate(modelQuery, {
      limit: modelLimit,
      page: modelPage,
      sort: modelSort,
    });

    const response = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `http://localhost:8080/api/products/?page=${products.prevPage}`
        : null,
      nextLink: products.hasNextPage
        ? `http://localhost:8080/api/products/?page=${products.nextPage}`
        : null,
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:pid", async (req, res) => {
  try {
    //FS METHOD
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
