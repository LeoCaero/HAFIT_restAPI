const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./product");
const Plan = require("../models/plan");

const userTypeEnum = ["client", "admin", "soci", "treballador"];

const userSchema = new Schema(
  {
    userId: {
      type: Number,
      required: false,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: userTypeEnum,
      required: true,
    },
    products: [
      {
        type: Product.schema,
        ref: "Product",
        required: false,
      },
    ],
    cartItems: [
      {
        type: Product.schema,
        ref: "Product",
        required: false,
        unique: true
      }
    ],
    plans:[
      {
      type: Plan.schema,
      ref: "Plan",
      required: false,
      unique: false
      }
    ]
  },
  { collection: "User" }
);


const User = mongoose.model("User", userSchema);

module.exports = User;


