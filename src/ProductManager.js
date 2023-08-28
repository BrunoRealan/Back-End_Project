import fs from "fs";
const productsFile = "./src/products.json";
const cartsFile = "./src/carts.json";

class ProductManager {
  static id = 0;
  static cid = 0;

  constructor() {
    this.productsPath = productsFile;
    this.cartsPath = cartsFile;
    this.initialize();
  }

  async initialize() {
    this.products = await this.getProducts();
    this.carts = await this.getCarts();
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.productsPath)) {
        const content = await fs.promises.readFile(this.productsPath, "utf-8");
        return JSON.parse(content);
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async saveProducts() {
    try {
      await fs.promises.writeFile(
        productsFile,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      console.log(error);
    }
  }

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
        return;
      }
      if (this.products.some((p) => p.id === ProductManager.id)) {
        return;
      }
      const newProduct = {
        id: ProductManager.id,
        ...product,
        status: true,
      };
      this.products.push(newProduct);

      //NO SE AUTOINCREMENTA ID???
      ProductManager.id++;
      await this.saveProducts();
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const found = products.find((p) => p.id === id);
      if (!found) {
        return undefined;
      }
      return found;
    } catch (error) {
      console.log(error);
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
      } else {
        console.log(
          `No se encontró el producto con ID "${id}" en la lista de productos`
        );
      }
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
    }
  }

  async createCart() {
    try {
      await this.initialize();
      const newCart = {
        id: ProductManager.cid,
        products: [],
      };
      this.carts.push(newCart);

      //NO SE AUTOINCREMENTA ID???
      ProductManager.cid++;
      await this.saveCarts();
    } catch (error) {
      console.log("Error al crear el carrito:", error);
    }
  }

  async saveCarts() {
    try {
      await fs.promises.writeFile(
        this.cartsPath,
        JSON.stringify(this.carts, null, 2)
      );
    } catch (error) {
      console.log("Error al guardar los carritos:", error);
    }
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.cartsPath)) {
        const content = await fs.promises.readFile(this.cartsPath, "utf-8");
        return JSON.parse(content);
      } else {
        return {
          id: 0,
          products: [],
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cartFound = carts.find((c) => c.id === id);
      if (!cartFound) {
        return undefined;
      }
      return cartFound;
    } catch (error) {
      console.log(error);
    }
  }

  async addToCart(cartId, productId) {
    try {
      await this.initialize();
      const product = await this.getProductById(productId);
      if (!product) {
        return;
      }
      const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex === -1) {
        return;
      }
      const cart = this.carts[cartIndex];
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product === productId
      );
      if (existingProductIndex === -1) {
        // Si el producto no existe en el carrito, lo agregamos con cantidad 1
        cart.products.push({ product: productId, quantity: 1 });
      } else {
        // Si el producto ya existe, incrementamos la cantidad
        cart.products[existingProductIndex].quantity++;
      }
      await this.saveCarts();
    } catch (error) {
      console.log(error);
    }
  }
}

export default ProductManager;