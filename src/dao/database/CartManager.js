import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

export default class CartManger {
  async createCart() {
    const newCart = await cartModel.create({});
    console.log(`Id del carrito es:${newCart._id}`);
    return newCart;
  }
  async getCarts() {
    const carts = await cartModel.find().lean();
    return carts;
  }
  async getCartById(id) {
    const cart = await cartModel.find({ _id: id }).lean();
    return cart;
  }
  async addToCart(cartId, productId) {
    try {
      // Verificar si el producto existe
      const product = await productModel.findOne({ _id: productId });

      if (!product) {
        console.log(`No existe el producto "${productId}"`);
        return;
      }

      // Verificar si existe un carrito con el cartId proporcionado
      let cart = await cartModel.findOne({ _id: cartId });
      console.log(cart);

      if (!cart) {
        // Si no existe un carrito con cartId, crear uno nuevo
        cart = new cartModel({
          _id: cartId,
          products: [{ product: productId, quantity: 1 }],
        });

        await cart.save();
      } else {
        // Si el carrito ya existe, verificar si el producto con productId ya está en el carrito
        const existingProduct = cart.products.find(
          (item) => item._id === productId
        );
        console.log(existingProduct,"error existing");

        if (!existingProduct) {
          // Si el producto no existe en el carrito, agregarlo con cantidad 1
          cart.products.push({ product: productId, quantity: 1 });
        } else {
          // Si el producto ya existe, incrementar la cantidad
          existingProduct.quantity++;
        }

        await cart.save();
      }

      console.log(`Producto "${productId}" agregado al carrito "${cartId}"`);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  }

  async deleteProduct(id) {
    await cartModel.deleteOne({ _id: id });
    console.log(`El producto de ID: ${id} ha sido borrado de la DB`);
  }
}
