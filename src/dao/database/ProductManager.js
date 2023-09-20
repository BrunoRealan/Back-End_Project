import { productModel } from "../models/product.model.js";

export default class ProductManager {
  async getProducts() {
    const products = await productModel.find().lean();
    return products;
  }

  async getProductById(id) {
    const product = await productModel.find({ _id: id }).lean();
    return product;
  }

  async addProduct(product) {
    const products = await productModel.find().lean();
    if (products.some((p) => p.code === product.code)) {
      console.log(`Ya existe un producto de código "${product.code}"`);
      return;
    }
    if (products.some((p) => p._id === product._id)) {
      console.log(`Ya existe un producto de ID "${product._id}"`);
      return;
    }
    const createdProduct = await productModel.create(product);
    console.log(
      `El producto de ID:"${createdProduct._id}" se agregó correctamente a la DB`
    );
  }

  async updateProduct(
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    await productModel.updateOne(
      { _id: id },
      { title, description, code, price, status, stock, category, thumbnail }
    );
  }

  async deleteProduct(id) {
    try {
      const productToDelete = await productModel.findOneAndDelete({ _id: id });

      productToDelete
        ? console.log(`El producto de Id ${id} ha sido borrado de la DB`)
        : console.log("El producto no existe o ya ha sido borrado");
    } catch (error) {
      console.log(error);
    }
  }
}
