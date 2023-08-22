const express = require("express");
const ProductMananger = require("./ProductMananger.json");
const productsMananger = new ProductMananger();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const limit = req.query.limit;
  const products = await productsMananger.getProducts();

  if (limit) {
    return res.send(autos.slice(0, limit));
  }

  res.send(products);
});

app.get("/products/:pId", async (req, res) => {
  const productId = parseInt(req.params.pId, 10);
  const product = await productsMananger.getProductById(productId);

  res.send(product);
});

app.listen(8080,()=>console.log("ok"));