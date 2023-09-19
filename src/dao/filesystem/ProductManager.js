import fs from "fs";
const productsFile = "./src/fs_files/products.json";
const cartsFile = "./src/fs_files/carts.json";

class ProductManager {
  id = 0;
  cid = 0;

  constructor() {
    this.productsPath = productsFile;
    this.cartsPath = cartsFile;
    this.initialize();
  }

  async initialize() {
    this.products = await this.getProducts();
    this.carts = await this.getCarts();
    const maxProductId = this.products.reduce((maxId, product) => {
      return product.id > maxId ? product.id : maxId;
    }, -1);

    const maxCartId = this.carts.reduce((maxCartId, cart) => {
      return cart.id > maxCartId ? cart.id : maxCartId;
    }, -1);

    ProductManager.id = maxProductId + 1;
    ProductManager.cid = maxCartId + 1;
  }

  //Métodos de los Productos
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
      console.log("Falta algun campo");
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
      console.log("Asegurate que los campos tienen valores válidos");
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
        console.log(`Ya existe un producto de código "${product.code}"`);
        return;
      }
      if (this.products.some((p) => p.id === ProductManager.id)) {
        console.log(`Ya existe un producto de ID "${ProductManager.id}"`);
        return;
      }
      const newProduct = {
        id: ProductManager.id,
        ...product,
        status: true,
      };
      this.products.push(newProduct);
      await this.saveProducts();
      console.log("El producto se agregó correctamente");
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const found = products.find((p) => p.id === id);
      if (!found) {
        console.log(
          `No se encontró un producto de ID "${id}" en la lista de productos`
        );
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
        console.log("El producto se actualizó correctamente");
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
      console.log("El producto se eliminó correctamente");
    } catch (error) {
      console.log(error);
    }
  }

  //Métodos de los Carritos
  async createCart() {
    try {
      await this.initialize();
      const newCart = {
        id: ProductManager.cid,
        products: [],
      };
      this.carts.push(newCart);
      await this.saveCarts();
      console.log("Carrito creado satisfactoriamente");
    } catch (error) {
      console.log(error);
    }
  }

  async saveCarts() {
    try {
      await fs.promises.writeFile(
        this.cartsPath,
        JSON.stringify(this.carts, null, 2)
      );
    } catch (error) {
      console.log(error);
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
        console.log(`El carrito con ID "${id}" no existe`);
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
        console.log(`No existe el producto "${productId}"`);
        return;
      }
      const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex === -1) {
        console.log(`No existe el carrito "${cartId}"`);
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
