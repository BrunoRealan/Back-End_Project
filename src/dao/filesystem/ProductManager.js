import fs from "fs";
import logger from "../../services/logger";
const productsFile = "./src/fs_files/products.json";

class ProductManager {
  id = 0;

  constructor() {
    this.productsPath = productsFile;
    this.initialize();
  }

  async initialize() {
    this.products = await this.getProducts();
    const maxProductId = this.products.reduce((maxId, product) => {
      return product.id > maxId ? product.id : maxId;
    }, -1);

    ProductManager.id = maxProductId + 1;
  }

  //METODOS DE LOS PRODUCTOS
  async getProducts() {
    try {
      if (fs.existsSync(this.productsPath)) {
        const content = await fs.promises.readFile(this.productsPath, "utf-8");
        return JSON.parse(content);
      } else {
        return [];
      }
    } catch (error) {
      logger.error(error);
    }
  }

  async saveProducts() {
    try {
      await fs.promises.writeFile(
        productsFile,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      logger.error(error);
    }
  }

  //Validacion de campos correctos
  validateProductFields(product) {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = product;
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      status === undefined ||
      !stock ||
      !category
    ) {
      logger.warning("Falta algun campo");
      return false;
    }
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof code !== "string" ||
      typeof price !== "number" ||
      typeof status !== "boolean" ||
      typeof stock !== "number" ||
      typeof category !== "string" ||
      !Array.isArray(thumbnail)
    ) {
      logger.warning("Asegurate que los campos tienen valores válidos");
      return false;
    }
    return true;
  }

  async addProduct(product) {
    try {
      await this.initialize();
      if (!this.validateProductFields(product)) {
        return;
      }
      if (this.products.some((p) => p.code === product.code)) {
        logger.warning(`Ya existe un producto de código "${product.code}"`);
        return;
      }
      if (this.products.some((p) => p.id === ProductManager.id)) {
        logger.warning(`Ya existe un producto de ID "${ProductManager.id}"`);
        return;
      }
      const newProduct = {
        id: ProductManager.id,
        ...product,
        status: true,
      };
      this.products.push(newProduct);
      await this.saveProducts();
      logger.info("El producto se agregó correctamente");
    } catch (error) {
      logger.error(error);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const found = products.find((p) => p.id === id);
      if (!found) {
        logger.warning(
          `No se encontró un producto de ID "${id}" en la lista de productos`
        );
        return undefined;
      }
      return found;
    } catch (error) {
      logger.error(error);
    }
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
    try {
      const productToUpdate = await this.getProductById(id);
      if (!productToUpdate) {
        return;
      }
      if (
        !this.validateProductFields({
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail,
        })
      ) {
        return;
      }
      Object.assign(productToUpdate, {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      });
      const index = this.products.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.products[index] = productToUpdate;
        await this.saveProducts();
        logger.info("El producto se actualizó correctamente");
      } else {
        logger.warning(
          `No se encontró el producto con ID "${id}" en la lista de productos`
        );
      }
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteProduct(id) {
    try {
      const productToDelete = await this.getProductById(id);
      if (productToDelete === undefined) {
        return;
      }
      const productIndex = this.products.findIndex(
        ({ id }) => id === productToDelete.id
      );
      this.products.splice(productIndex, 1);
      await this.saveProducts();
      logger.info("El producto se eliminó correctamente");
    } catch (error) {
      logger.error(error);
    }
  }
}

export default ProductManager;
