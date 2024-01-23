import ProductManager from "../managers/ProductManager.js";
import CartManger from "../managers/CartManager.js";
import UserManager from "../managers/UserManager.js";
import logger from "../services/logger.js";

const productManager = new ProductManager();
const cartManager = new CartManger();
const userManager = new UserManager();

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

    res.render("products", {
      response,
      first_name,
      last_name,
      email,
      age,
      role,
    });
  } catch (error) {
    logger.error(error);
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
    logger.error(error);
    res.status(404).send();
  }
};

export const getCartById = async (req, res) => {
  try {
    const { first_name, last_name, email, age } = req.session;
    const cartId = req.params.cId.trim(); //trim() Elimina espacios en blanco al principio y al final de params
    const cartDocument = await cartManager.getCartById(cartId);
    const response = cartDocument.toObject(); //toObject() Retorna objeto palano para handlebars
    res.status(200).render("cart", {
      response,
      first_name,
      last_name,
      email,
      age,
      cartId,
    });
  } catch (error) {
    logger.error(error);
    res.status(404).send();
  }
};

export const realTimeProducts = async (req, res) => {
  try {
    res.status(200).render("realTimeProducts", {});
  } catch (error) {
    logger.error(error);
    res.status(404).send();
  }
};

export const chat = async (req, res) => {
  try {
    res.status(200).render("chat", {});
  } catch (error) {
    logger.error(error);
    res.status(404).send();
  }
};

export const signup = async (req, res) => {
  try {
    res.status(200).render("signup");
  } catch (error) {
    logger.error(error);
    res.status(505).send();
  }
};

export const login = async (req, res) => {
  try {
    res.status(200).render("login");
  } catch (error) {
    logger.error(error);
    res.status(505).send();
  }
};

export const logout = async (req, res) => {
  try {
    await userManager.updateLastConnection(req.session.email);
    req.session.destroy();
    res.status(200).redirect("/login");
  } catch (error) {
    logger.error(error);
    res.status(505).send();
  }
};

export const sendResetPassword = async (req, res) => {
  try {
    res.status(200).render("sendResetPassword", {});
  } catch (error) {
    logger.error(error);
    res.status(505).send();
  }
};

export const resetPassword = async (req, res) => {
  try {
    const recoverId = req.params.rId;
    const recover = await userManager.getRecoverTicket(recoverId);
    const actualDate = new Date();

    if (recover.expire_at.getTime() <= actualDate.getTime()) {
      logger.warning("Token expirado");
      return res.send("Error,token expirado");
    }
    res.render("resetPassword", { recoverId });
  } catch (error) {
    logger.error(error);
  }
};

export const failregister = (req, res) => {
  try {
    res.status(200).send("Fallo de registro");
  } catch (error) {
    logger.error(error);
    res.status(505).send();
  }
};

export const profile = async (req, res) => {
  try {
    const { first_name, last_name, email, age, role, cart } = req.session;
    res
      .status(200)
      .render("profile", { first_name, last_name, email, age, role, cart });
  } catch (error) {
    logger.error(error);
    res.status(505).send();
  }
};

export const admin = async (req, res) => {
  try {
    if (req.session.role !== "admin") {
      logger.warning("No tienes permisos para acceder a la sección admin");
      return res.redirect("/login");
    }
    const users = await userManager.getAllUsers();
    res.status(200).render("admin", { users });
  } catch (error) {
    logger.error(error);
    res.status(505).send();
  }
};
