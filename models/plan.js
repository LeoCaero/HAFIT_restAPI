const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const planSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    planId: {
      type: Number,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    featuredImg: {
      type: String,
      default: "",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      unique: false
    }
  },
  { collection: "Plan" }
);

const Plan = mongoose.model("Plan", planSchema);


module.exports = Plan;
