import { cartModel } from "../dao/database/models/cartModel.js";
import logger from "../services/logger.js";

export class CartRepository {
  create = async () => {
    try {
      const newCart = await cartModel.create({});
      logger.info(`Id del carrito es:${newCart._id}`);
      return newCart;
    } catch (error) {
      logger.error(error);
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
      logger.error(error);
    }
  };

  getById = async (id) => {
    try {
      const cart = await cartModel
        .findOne({ _id: id })
        .populate({ path: "products.product", model: "products" });
      return cart;
    } catch (error) {
      logger.error(error);
    }
  };

  update = async (id, productsToUpdate) => {
    try {
      await cartModel.updateOne({ _id: id }, { products: productsToUpdate });
      return;
    } catch (error) {
      logger.error(error);
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
      logger.error(error);
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
      logger.error(error);
    }
  };
}
