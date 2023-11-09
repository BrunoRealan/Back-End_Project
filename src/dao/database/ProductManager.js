import { productModel } from "./models/product.model.js";
export default class ProductManager {
  async getProducts(limit, query, sort, page) {
    try {
      const sortObjectMapper = {
        asc: { price: 1 },
        desc: { price: -1 },
      };

      const modelLimit = limit ? parseInt(limit, 10) : 10;
      const modelQuery = query ? JSON.parse(query) : {};
      const modelSort = sortObjectMapper[sort] ?? undefined;
      const modelPage = page ? parseInt(page, 10) : 1;

      const products = await productModel.paginate(modelQuery, {
        limit: modelLimit,
        page: modelPage,
        sort: modelSort,
        lean: true,
      });

      const response = {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `http://localhost:8080/products/?page=${products.prevPage}`
          : null,
        nextLink: products.hasNextPage
          ? `http://localhost:8080/products/?page=${products.nextPage}`
          : null,
      };
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    const product = await productModel.paginate({ _id: id }, { lean: true });
    return product;
  }

  async addProduct(product) {
    const products = await productModel.paginate({}, { lean: true });
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
