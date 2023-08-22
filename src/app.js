const express = require("express");
const ProductMananger = require("./ProductMananger");
const productsMananger = new ProductMananger();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products", (req, res) => {
  const limit = req.query.limit;
  const products = productsMananger.getProducts();

  if (limit) {
    return res.send(autos.slice(0, limit));
  }

  res.send(products);
});

app.get("/products/:pId", (req, res) => {
  const productId = parseInt(req.params.pId, 10);
  const products = productsMananger.getProducts();
  const product = products.find(({ id }) => id === productId);
  
  res.send(product);
});
