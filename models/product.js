const mongoose = require("mongoose");
const defaultValues = require("../utils/defaultValues.js");

const ProductSchema = new mongoose.Schema(
  {
    productId: Number,
    name: String,
    price: {
      type: mongoose.Decimal128,
    },
    description: String,
    type: String,
    stock: Number,
    image: {
      type: String,
      default: defaultValues.product.image
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  { collection: "Product", versionKey: false }
);

ProductSchema.methods.toJSON = function () {
  return { ...this.toObject(), id: this._id };
};



const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;