import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product" // Referencia al modelo de producto
      },
      quantity: Number,
    },
  ],
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export { cartModel };
