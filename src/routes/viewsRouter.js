import { Router } from "express";
//import ProductManager from "../dao/filesystem/ProductManager.js";
import ProductManager from "../dao/database/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", {products});
});

router.get("/realtimeproducts", async (req,res)=>{
res.render("realTimeProducts",{})
})
export default router;