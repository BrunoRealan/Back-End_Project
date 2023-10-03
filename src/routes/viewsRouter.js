import { Router } from "express";
//import ProductManager from "../dao/filesystem/ProductManager.js";
import { productModel } from "../dao/models/product.model.js";
import { cartModel } from "../dao/models/cart.model.js";
import publicRoutes from "../middleware/publicRoutes.js";
import privateRoutes from "../middleware/privateRoutes.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await productModel.paginate({}, { lean: true });
  const productsDoc = products.docs;
  res.render("home", { productsDoc });
});

router.get("/products", async (req, res) => {
  try {
    const { first_name, last_name, email, age } = req.session;
    const { limit, query, sort, page } = req.query;
    const sortObjectMapper = {
      asc: { price: 1 },
      desc: { price: -1 },
    };

    const modelQuery = query ? JSON.parse(query) : {};
    const modelLimit = limit ? parseInt(limit, 10) : 10;
    const modelPage = page ? parseInt(page, 10) : 1;
    const modelSort = sortObjectMapper[sort] ?? undefined;

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
    res.render("products", { response, first_name, last_name, email, age });
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});

//FUNCION DEL PROBLEMA A RESOLVER!
router.get("/cart/:cId", async (req, res) => {
  try {
    const { first_name, last_name, email, age } = req.session;
    const cartId = req.params.cId.trim(); //trim() Elimina espacios en blanco al principio y al final de params
    const cart = await cartModel
      .findOne({ _id: cartId })
      .populate("products.product");
    const productsOfCart = cart.products;
    console.log(productsOfCart);//PRODUCTOS CORRECTOS
    res.render("cart", { productsOfCart, first_name, last_name, email, age });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {});
});

router.get("/chat", async (req, res) => {
  res.render("chat", {});
});

router.get("/signup", publicRoutes, async (req, res) => {
  res.render("signup");
});

router.get("/login", publicRoutes, async (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

router.get("/profile", privateRoutes, async (req, res) => {
  const { first_name, last_name, email, age } = req.session;
  res.render("profile", { first_name, last_name, email, age });
});

export default router;
