import { Router } from "express";
//import ProductManager from "../dao/filesystem/ProductManager.js";
import CartManager from "../dao/database/CartManager.js";
import { cartModel } from "../dao/models/cart.model.js";
const router = Router();
const cartManager = new CartManager();

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
    //FS METHOD
    /*const cartId = parseInt(req.params.cid, 10);
         if (isNaN(cartId) || cartId < 0) {
      return res.status(400).send();
    }
    */
    const cartId = req.params.cid.trim(); //trim() Elimina espacios en blanco al principio y al final del param
    //const cart = await cartManager.getCartById(cartId);
    const cart = await cartModel
      .findOne({ _id: cartId })
      .populate("products.product");
    return cart === null
      ? console.log("No existe el carrito seleccionado")
      : res.status(200).send(cart.products);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.post("/", async (req, res) => {
  try {
    await cartManager.createCart();
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    //const cartId = parseInt(req.params.cid, 10);
    //const productId = parseInt(req.params.pid, 10);
    const cartId = req.params.cid.trim();
    const productId = req.params.pid.trim();

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

router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;
    await cartModel.updateOne(
      {
        _id: req.params.cid.trim(),
      },
      { products: products }
    );
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid.trim();
    const productId = req.params.pid.trim();
    const { quantity } = req.body;

    const cart = await cartModel.findOne({ _id: cartId });
    if (!cart) {
      return res.status(404).send("El carrito no existe");
    }

    const productToUpdate = cart.products.find((item) =>
      item.product.equals(productId)
    );
    if (!productToUpdate) {
      res.status(404).send("El producto no existe en el carrito");
    }
    productToUpdate.quantity = quantity;
    await cart.save();
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid.trim();
  const productId = req.params.pid.trim();

  try {
    const result = await cartModel.findOneAndUpdate(
      { _id: cartId },
      { $pull: { products: { product: { _id: productId } } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send("El producto no se encontró en el carrito.");
    }
    console.log(result);
    res.send("El producto ha sido eliminado del carrito.");
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid.trim();

  try {
    const result = await cartModel.findOneAndUpdate(
      { _id: cartId },
      { products: [] }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send("El producto no se encontró en el carrito.");
    }
    console.log(result);
    res.send("El producto ha sido eliminado del carrito.");
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

export default router;
