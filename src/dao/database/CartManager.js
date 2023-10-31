import { cartModel } from "./models/cart.model.js";
import { productModel } from "./models/product.model.js";
import mongoose from "mongoose";

export default class CartManger {
  async createCart() {
    try {
      const newCart = await cartModel.create({});
      console.log(`Id del carrito es:${newCart._id}`);
      return newCart;
    } catch (error) {
      console.log(error);
    }
  }

  async getCarts() {
    try {
      const carts = await cartModel.paginate({}, { lean: true });
      return carts.docs;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartModel.paginate({ _id: id }, { lean: true });
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async addToCart(cartId, productId) {
    try {
      // Verificar si el producto existe
      const productIdObject = new mongoose.Types.ObjectId(productId);
      const product = await productModel.findOne({ _id: productId });
      if (!product) {
        console.log(`No existe el producto "${productId}"`);
        return;
      }
      // Verificar si existe un carrito con el cartId proporcionado
      const cart = await cartModel.findOne({ _id: cartId });
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
      } else if (existingProduct) {
        if (existingProduct.quantity >= product.stock) {
          console.log("No puedes agregar el producto por falta de Stock");
          return;
        } else {
          existingProduct.quantity++;
        }
      }
      await cart.save();
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  }

  async deleteCart(id) {
    try {
      const cartToDelete = await cartModel.findOneAndDelete({ _id: id });
      cartToDelete
        ? console.log(`El carrito de Id ${id} ha sido borrado de la DB`)
        : console.log("El carrito no existe o ya ha sido borrado");
    } catch (error) {
      console.log(error);
    }
  }
}
