import CartManger from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";
import logger from "../services/logger.js";

const cartManager = new CartManger();
const productManager = new ProductManager();

export const createCart = async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(200).send({ status: "success", newCart });
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};

export const getCarts = async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).send({ status: "success", carts });
  } catch (error) {
    logger.error(error);
    res.status(404).send();
  }
};

export const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cId.trim(); //trim() Elimina espacios en blanco al principio y al final del param
    const cart = await cartManager.getCartById(cartId);
    res.status(200).send({ status: "success", cart });
  } catch (error) {
    logger.error(error);
    res.status(404).send();
  }
};

export const addToCart = async (req, res) => {
  try {
    const cartId = req.params.cId.trim();
    const productId = req.params.pId.trim();
    const product = await productManager.getProductById(productId);
    if (product === undefined) {
      logger.warning("No existe el producto que quieres agregar");
      return res.status(400).send();
    }
    if (req.session.role === "premium") {
      product.owner === req.session.email
        ? alert("No puedes agregar tu propio producto a tu carrito")
        : await cartManager.addToCart(cartId, productId);
      return res.status(200).send({ status: "success" });
    }
    await cartManager.addToCart(cartId, productId);
    res.status(200).send({ status: "success" });
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};

export const updateCart = async (req, res) => {
  try {
    const cartId = req.params.cId.trim();
    const { products } = req.body;
    const cartUpdated = cartManager.updateCart(cartId, products);
    res.status(200).send({ status: "success", cartUpdated });
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};

export const modifyQuantityInCart = async (req, res) => {
  try {
    const cartId = req.params.cId.trim();
    const productId = req.params.pId.trim();
    const { quantity } = req.body;
    const modifiedCart = await cartManager.modifyQuantityInCart(
      cartId,
      productId,
      quantity
    );
    res.status(200).send({ status: "success", modifiedCart });
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};

//revisar
export const deleteProductInCart = async (req, res) => {
  try {
    const cartId = req.params.cId.trim();
    const productId = req.params.pId.trim();
    const productCartDeleted = await cartManager.deleteProductCart(
      cartId,
      productId
    );
    res.status(200).send({
      status: "The product in cart was eliminated",
      productCartDeleted,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};

export const deleteInCart = async (req, res) => {
  try {
    const cartId = req.params.cId.trim();
    const cartDeleted = await cartManager.deleteCart(cartId);
    res
      .status(200)
      .send({ status: "The products in cart was eliminated", cartDeleted });
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};

export const purchase = async (req, res) => {
  try {
    const cartId = req.params.cId.trim();
    const purchaser = req.session.email;
    const newTicket = await cartManager.purchaseCart(cartId, purchaser);
    res.status(200).send({ status: "success", ticket: newTicket });
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};
