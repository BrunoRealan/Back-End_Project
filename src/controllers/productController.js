import ProductManager from "../managers/ProductManager.js";
import logger from "../services/logger.js";

const productManager = new ProductManager();

export const getProducts = async (req, res) => {
  try {
    const { limit, query, sort, page } = req.query;
    const response = await productManager.getProducts(limit, query, sort, page);
    res.status(200).send({ status: "success", response });
  } catch (error) {
    logger.error(error);
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
    res.status(201).send(product);
  } catch (error) {
    logger.error(error);
    res.status(404).send();
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    } = req.body;
    let owner = "admin";

    if (req.session.role === "premium") {
      owner = req.session.email;
    } else {
      owner = "admin";
    }

    await productManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
      owner
    );
    const products = await productManager.getProducts();
    req.context.socketServer.emit("updateProducts", products);
    res.status(200).send("El producto ha sido actualizado correctamente");
  } catch (error) {
    logger.error(error);
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
    if (req.session.role === "admin") {
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
    }
    if (req.session.role === "premium") {
      productFound.owner === req.session.email
        ? await productManager.deleteProduct(productId)
        : alert("No puedes borrar un producto que no te pertenece");
    }

    const products = await productManager.getProductsAll();
    req.context.socketServer.emit("updateProducts", products);
    res.status(200).send("El producto ha sido actualizado correctamente");
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};

export const deleteProduct = async (req, res) => {
  try {
    //const productId = parseInt(req.params.pid, 10);
    const productId = req.params.pid;
    const productFound = await productManager.getProductById(productId);
    if (productFound === undefined) {
      logger.warning("No existe el producto que quieres borrar");
      res.status(400).send();
    }
    if (req.session.role === "admin") {
      await productManager.deleteProduct(productId);
    }
    if (req.session.role === "premium") {
      productFound.owner === req.session.email
        ? await productManager.deleteProduct(productId)
        : logger.warning("No puedes borrar un producto que no te pertenece"),
        alert("No puedes borrar un producto que no te pertenece");
    }

    const products = await productManager.getProducts();
    req.context.socketServer.emit("updateProducts", products);
    res.status(200).send("El producto ha sido borrado correctamente");
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};
