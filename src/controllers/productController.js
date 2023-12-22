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

    const createdProduct = await productManager.addProduct(
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
    res
      .status(200)
      .send(createdProduct);
  } catch (error) {
    logger.error(error);
    res.status(400).send({ status: "failure", message: "Bad request" });
  }
};

export const updateProduct = async (req, res) => {
  try {
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
    if (req.session.role === "premium") {
      if (productFound.owner === req.session.email) {
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
        return res.status(200).send({
          status: "success",
          message: "Producto actualizado correctamente",
        });
      } else {
        return res.status(403).send({
          status: "failure",
          message: "No puedes actualizar un producto que no te pertenece",
        });
      }
    } else {
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
      return res.status(200).send({
        status: "success",
        message: "Producto actualizado correctamente",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ status: "failure", message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    const productFound = await productManager.getProductById(productId);
    if (productFound === undefined) {
      logger.warning("No existe el producto que quieres borrar");
      return res.status(400).send();
    }
    if (req.session.role === "premium") {
      if (productFound.owner === req.session.email) {
        await productManager.deleteProduct(productId);
        const products = await productManager.getProducts();
        req.context.socketServer.emit("updateProducts", products);
        return res.status(200).send({
          status: "success",
          message: "El producto ha sido borrado correctamente",
        });
      } else {
        return res.status(403).send({
          status: "failure",
          message: "No puedes borrar un producto que no te pertenece",
        });
      }
    } else {
      await productManager.deleteProduct(productId);
      const products = await productManager.getProducts();
      req.context.socketServer.emit("updateProducts", products);
      return res.status(200).send({
        status: "success",
        message: "El producto ha sido borrado correctamente",
      });
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .send({ status: "failure", message: "Internal server error" });
  }
};
