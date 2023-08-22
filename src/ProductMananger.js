const fs = require("fs");
const file = "./Products.js";

class ProductMananger {
  static id = 0;
  title;
  description;
  price;
  thumbnail;
  code;
  stock;

  constructor(path) {
    this.path = path;
    this.products = this.getProducts();
  }

  getProducts() {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf-8");
      return JSON.parse(content);
    } else {
      return [];
    }
  }

  saveProducts = async () => {
    try {
      await fs.promises.writeFile(file, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.log(error);
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    try {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Falta algún campo.");
        return;
      }
      if (
        this.products.some(
          (p) => p.code === code || p.id === ProductMananger.id
        )
      ) {
        console.log("Ya existe un producto con este código o ID.");
        return;
      }

      const product = {
        id: ProductMananger.id++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      this.products.push(product);
      await this.saveProducts();
    } catch (error) {
      console.log(error);
    }
  };

  getProductsById = (id) => {
    this.products = this.getProducts();
    const found = this.products.find((p) => p.id === id);
    if (found === undefined) {
      console.log(`El ID "${id}" no se encuentra en la DB`);
      return undefined;
    }
    return found;
  };

  updateProduct = async (
    id,
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  ) => {
    try {
      const productToUpdate = await this.getProductsById(id);
      if (!productToUpdate) {
        console.log(`El ID "${id}" no se encuentra en la DB`);
        return;
      }
      productToUpdate.title = title;
      productToUpdate.description = description;
      productToUpdate.price = price;
      productToUpdate.thumbnail = thumbnail;
      productToUpdate.code = code;
      productToUpdate.stock = stock;
      await this.saveProducts();
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (id) => {
    const productToDelete = this.getProductsById(id);
    if (!productToDelete) {
      console.log(
        `El producto con ID "${id}" no se encuentra en la DB, por lo tanto no se puede borrar`
      );
      return;
    }
    this.products = this.products.filter((p) => p.id !== id);
    await this.saveProducts();
  };
}

module.export = ProductMananger;