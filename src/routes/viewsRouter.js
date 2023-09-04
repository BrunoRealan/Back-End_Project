import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  console.log(products);
  res.render("home", {products});
});

router.get("/realtimeproducts", async (req,res)=>{
  const products = await productManager.getProducts();
  req.context.socketServer.emit("updateProducts", products);
res.render("realTimeProducts",{products})
})
export default router;