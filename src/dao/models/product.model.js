import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: Array,
  code: String,
  stock: Number,
  status: Boolean,
  category: String,
});

const productModel = mongoose.model(productCollection, productSchema);

export { productModel };