const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: mongoose.Decimal128,
    default: 0.00,
  },
  description: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  stock: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: "",
  },
}, { collection: 'Product' });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
