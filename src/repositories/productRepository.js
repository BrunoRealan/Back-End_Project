import { productModel } from "../dao/database/models/productModel.js";

export class ProductRepository {
  create = async (product) => {
    const createdProduct = await productModel.create(product);
    return createdProduct;
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
      console.log(error);
    }
  };

  getAll = async () => {
    try {
      const products = await productModel.find({});
      return products;
    } catch (error) {
      console.log(error);
    }
  };

  getById = async (id) => {
    try {
      const product = await productModel.findOne({ _id: id });
      return product;
    } catch (error) {
      console.log(error);
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
      await productModel.updateOne(
        { _id: id },
        { title, description, code, price, status, stock, category, thumbnail }
      );
    } catch (error) {
      console.log(error);
    }
  };

  delete = async (id) => {
    try {
      const productToDelete = await productModel.findOneAndDelete({ _id: id });
      return productToDelete;
    } catch (error) {
      console.log(error);
    }
  };
}
