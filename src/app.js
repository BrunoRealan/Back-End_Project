import express from "express";
import ProductMananger from "./ProductMananger.js";
const productsMananger = new ProductMananger();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productsMananger.getProducts();

    if (limit) {
      return res.send(products.slice(0, limit));
    }
    res.send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("An error occurred while fetching products.");
  }
});

app.get("/products/:pId", async (req, res) => {
  const productId = parseInt(req.params.pId, 10);
  const product = await productsMananger.getProductById(productId);

  res.send(product);
});

app.post("/", async (req, res) => {
  const newProduct = await productsMananger.addProduct(req.body.title,req.body.description,req.body.price,req.body.thumbnail,req.body.code,req.body.stock);
  res.send(newProduct)
});

app.listen(8080, () => console.log("ok"));
