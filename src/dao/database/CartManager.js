import { CartRepository } from "../../repositories/cartRepository.js";
import { ProductRepository } from "../../repositories/productRepository.js";
import { TicketReposiotory } from "../../repositories/ticketRepository.js";
import crypto from "crypto";
import mongoose from "mongoose";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketReposiotory();

export default class CartManger {
  createCart = async () => {
    try {
      await cartRepository.create();
      return;
    } catch (error) {
      console.log(error);
    }
  };

  getCarts = async () => {
    try {
      const carts = await cartRepository.getAll();
      return carts;
    } catch (error) {
      console.log(error);
    }
  };

  getCartById = async (id) => {
    try {
      const cart = await cartRepository.getById(id);
      return cart === null
        ? console.log("No existe el carrito seleccionado")
        : cart;
    } catch (error) {
      console.log(error);
    }
  };

  addToCart = async (cartId, productId) => {
    try {
      // Verificar si el producto existe
      const productIdObject = new mongoose.Types.ObjectId(productId);
      const product = await productRepository.getById(productId);
      if (!product) {
        console.log(`No existe el producto "${productId}"`);
        return;
      }
      // Verificar si existe un carrito con el cartId proporcionado
      const cart = await cartRepository.getById(cartId);
      if (!cart) {
        console.log(`El carrito de ID:${cartId} no existe`);
        return;
      }
      // Si el carrito ya existe, verificar si el producto con productId ya está en el carrito
      const existingProduct = cart.products.find((item) => {
        return item.product.equals(productIdObject);
      });

      // Si el producto no existe en el carrito y hay Stock agregarlo con cantidad 1, y si existe, que no supere Stock
      if (!existingProduct && product.stock !== 0) {
        cart.products.push({ product: productIdObject, quantity: 1 });
        console.log("Se agrego un producto al carrito");
      } else if (existingProduct) {
        if (existingProduct.quantity >= product.stock) {
          console.log("No puedes agregar el producto por falta de Stock");
          return;
        } else {
          existingProduct.quantity++;
          console.log("Agregaste un producto más a los que tenías");
        }
      } else {
        console.log("No puedes agregar un producto con stock 0");
      }
      await cart.save();
      return;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  };

  updateCart = async (id, productsToUpdate) => {
    try {
      await cartRepository.update(id, productsToUpdate);
      return;
    } catch (error) {
      console.log(error);
    }
  };

  modifyQuantityInCart = async (cartId, productId, quantity) => {
    try {
      const cart = await cartRepository.getById(cartId);
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
      return;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProductInCart = async (cartId, productId) => {
    try {
      const result = await cartRepository.delete(cartId, productId);

      if (result.modifiedCount === 0) {
        return console.log("El producto no se encontró en el carrito.");
      }
      return console.log("El producto ha sido eliminado del carrito.");
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  };

  deleteCart = async (id) => {
    try {
      const result = await cartRepository.deleteAll(id);

      if (result.modifiedCount === 0) {
        return console.log("Los productos no se han encontrado en el carrito.");
      }
      console.log("Los productos han sido eliminados del carrito.");
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  };

  purchaseCart = async (id, purchaser) => {
    try {
      const cart = await cartRepository.getById(id);
      const productsCart = cart.products;
      console.log(cart, "cart");
      console.log(productsCart, "productsCart");
      let productsPurchased = [];
      let productsNotPurchased = [];
      let amount = 0;

      if (productsCart.length === 0) {
        return console.log(
          "No puedes realizar la compra, ya que no tienes productos en el carrito."
        );
      }

      for (const item of productsCart) {
        const product = await productRepository.getById(item.product._id);
        console.log(product.stock);

        if (item.quantity <= product.stock) {
          // Si hay suficiente stock, restar del stock y agregar al array de productos comprados
          product.stock -= item.quantity;
          await product.save();
          productsPurchased.push(item);

          // Calcular el total solo para los productos comprados
          const productTotal = item.product.price * item.quantity;
          amount += productTotal;
        } else {
          // Si no hay suficiente stock, agregar al array de productos no comprados
          productsNotPurchased.push(item);
        }
      }

      // Guardar el carrito actualizado
      cart.products = productsNotPurchased;
      await cart.save();

      function generateUniqueCode() {
        return crypto.randomBytes(12).toString("hex");
      }
      console.log(productsPurchased, "purcheased");
      console.log(productsNotPurchased, "notPur");
      console.log(amount);
      const code = generateUniqueCode();
      // Crear el ticket solo con los productos comprados
      const newTicket = await ticketRepository.create(code, amount, purchaser);
      console.log(newTicket, "newTicket");

      return { newTicket, productsNotPurchased };
    } catch (error) {
      console.error(error);
    }
  };
}
