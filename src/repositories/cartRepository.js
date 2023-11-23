import { cartModel } from "../dao/database/models/cartModel.js";

export class CartRepository {
  create = async () => {
    try {
      const newCart = await cartModel.create({});
      console.log(`Id del carrito es:${newCart._id}`);
      return newCart;
    } catch (error) {
      console.log(error);
    }
  };

  getAll = async () => {
    try {
      const carts = await cartModel.find();
      const cartsDTO = {
        //DTO FOR GETCARTS
      };
      return carts;
    } catch (error) {
      console.log(error);
    }
  };

  getById = async (id) => {
    try {
      const cart = await cartModel
        .findOne({ _id: id })
        .populate({ path: "products.product", model: "products" });
      return cart;
    } catch (error) {
      console.log(error);
    }
  };

  update = async (id, productsToUpdate) => {
    try {
      await cartModel.updateOne({ _id: id }, { products: productsToUpdate });
      return;
    } catch (error) {
      console.log(error);
    }
  };

  delete = async (cartId, productId) => {
    try {
      const result = await cartModel.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: { _id: productId } } } }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  deleteAll = async (cartId) => {
    try {
      const result = await cartModel.findOneAndUpdate(
        { _id: cartId },
        { products: [] }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  };
}
