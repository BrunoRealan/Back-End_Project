import ProductManager from "../dao/database/ProductManager.js";

const productManager = new ProductManager();

export const getProducts = async (req, res) => {
  try {
    const { limit, query, sort, page } = req.query;
    const response = await productManager.getProducts(limit, query, sort, page);
    res.status(200).send({ status: "success", response });
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    if (product === undefined) {
      return res.status(400).send();
    }
    res.status(200).send(product);
  } catch (error) {
    console.error(error);
    res.status(404).send();
  }
};

export const addProduct = async (req, res) => {
  try {
    await productManager.addProduct(req.body);
    const products = await productManager.getProducts();
    req.context.socketServer.emit("updateProducts", products);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

export const updateProduct = async (req, res) => {
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
    const products = await productManager.getProductsAll();
    req.context.socketServer.emit("updateProducts", products);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

export const deleteProduct = async (req, res) => {
  try {
    //const productId = parseInt(req.params.pid, 10);
    const productId = req.params.pid;
    const productFound = await productManager.getProductById(productId);
    if (productFound === undefined) {
      res.status(400).send();
    }
    console.log(productFound);
    await productManager.deleteProduct(productId);
    const products = await productManager.getProducts();
    req.context.socketServer.emit("updateProducts", products);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};
