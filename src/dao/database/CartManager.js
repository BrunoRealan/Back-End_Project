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
      const cart = await cartModel
        .findOne({ _id: id })
        .populate("products.product");
      return cart === null
        ? console.log("No existe el carrito seleccionado")
        : cart.products;
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
      return;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  }

  async updateCart(id, productsToUpdate) {
    try {
      await cartModel.updateOne({ _id: id }, { products: productsToUpdate });
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async modifyQuantityInCart(cartId, productId, quantity) {
    try {
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
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductCart(cartId, productId) {
    try {
      const result = await cartModel.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: { _id: productId } } } }
      );

      if (result.modifiedCount === 0) {
        return res
          .status(404)
          .send("El producto no se encontró en el carrito.");
      }
      console.log(result);
      res.send("El producto ha sido eliminado del carrito.");
      return;
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  }

  async deleteCart(id) {
    try {
      const result = await cartModel.findOneAndUpdate(
        { _id: cartId },
        { products: [] }
      );

      if (result.modifiedCount === 0) {
        return res
          .status(404)
          .send("El producto no se encontró en el carrito.");
      }
      console.log(result);
      res.send("El producto ha sido eliminado del carrito.");
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  }
}
