import ProductManager from "../dao/database/ProductManager.js";
import CartManger from "../dao/database/CartManager.js";

const productManager = new ProductManager();
const cartManager = new CartManger();

export const getProductsLogged = async (req, res) => {
  try {
    const { first_name, last_name, email, age, role, cart } = req.session;
    const { limit, query, sort, page } = req.query;
    const response = await productManager.getProducts(limit, query, sort, page);
    //SETEO CART ID AL RESPONSE DE CADA BOTON
    response.payload.forEach((e) => {
      e.cart = cart;
    });
    //SETEO CART ID AL RESPONSE PARA LINK A CART
    response.payload.cart = cart;
    console.log(response.payload);

    res.render("products", {
      response,
      first_name,
      last_name,
      email,
      age,
      role,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
};

export const getProducts = async (req, res) => {
  try {
    const { limit, query, sort, page } = req.query;
    const response = await productManager.getProducts(limit, query, sort, page);

    res.render("home", {
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
};

export const getCartById = async (req, res) => {
  try {
    const { first_name, last_name, email, age } = req.session;
    const cartId = req.params.cId.trim(); //trim() Elimina espacios en blanco al principio y al final de params
    const response = await cartManager.getCartById(cartId);
    console.log(response);

    res.render("cart", { response, first_name, last_name, email, age });
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
};
