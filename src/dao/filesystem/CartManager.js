import fs from "fs";
import ProductManager from "./ProductManager.js";

const cartsFile = "./src/fs_files/carts.json";
const productManager = new ProductManager();

class CartManager {
  id = 0;

  constructor() {
    this.cartsPath = cartsFile;
    this.initialize();
  }

  async initialize() {
    this.carts = await this.getCarts();
    const maxCartId = this.carts.reduce((maxCartId, cart) => {
      return cart.id > maxCartId ? cart.id : maxCartId;
    }, -1);

    CartManager.id = maxCartId + 1;
  }

  //METODOS DE LOS CARRITOS
  async createCart() {
    try {
      await this.initialize();
      const newCart = {
        id: CartManager.id,
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
      const product = await productManager.getProductById(productId);
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

export default CartManager;