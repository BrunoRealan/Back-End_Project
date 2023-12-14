import { productModel } from "../dao/database/models/productModel.js";
import logger from "../services/logger.js";

export class ProductRepository {
  create = async (product) => {
    try {
      const createdProduct = await productModel.create(product);
      return createdProduct;
    } catch (error) {
      logger.error(error);
    }
  };

  get = async (modelLimit, modelQuery, modelSort, modelPage) => {
    try {
      const products = await productModel.paginate(modelQuery, {
        limit: modelLimit,
        page: modelPage,
        sort: modelSort,
        lean: true,
      });
      return products;
    } catch (error) {
      logger.error(error);
    }
  };

  getAll = async () => {
    try {
      const products = await productModel.find({});
      return products;
    } catch (error) {
      logger.error(error);
    }
  };

  getById = async (id) => {
    try {
      const product = await productModel.findOne({ _id: id });
      return product;
    } catch (error) {
      logger.error(error);
    }
  };

  update = async (
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) => {
    try {
      const productUpdated = await productModel.updateOne(
        { _id: id },
        { title, description, code, price, status, stock, category, thumbnail }
      );
      return productUpdated;
    } catch (error) {
      logger.error(error);
    }
  };

  delete = async (id) => {
    try {
      const productToDelete = await productModel.findOneAndDelete({ _id: id });
      console.log(productToDelete);
      return productToDelete;
    } catch (error) {
      logger.error(error);
    }
  };
}
