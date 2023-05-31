const mongoose = require("mongoose");
const User = require("./user");
const Product = require("./product")
const userSchema = require("./user");
const defaultValues = require("../utils/defaultValues");
  

const PlanSchema = new mongoose.Schema(
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
  featuredImg:{
    type:String,
    default: defaultValues.product.image
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  view:{
    type: Number,
    default: 0
  }
  
}, { collection: 'Plan' });


PlanSchema.index({planId: 1}, { unique: true });
const Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan;