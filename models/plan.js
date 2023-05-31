const mongoose = require("mongoose");
const User = require("./user");
  

const planSchema = new mongoose.Schema({
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
    default: ''
  },user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  view:{
    type: Number,
    default: 0
  }
  // autorId: {
  //     type: User.schema,
  //     ref: "User",
  //     required: false,
  //     default:"",
  // },
  // user: [
  //   {
  //   type: User.schema,
  //   ref: "User",
  //   required:false,
  //   default:"",
  //   }
  // ]
  
}, { collection: 'Plan' });


const Plan = mongoose.model('Plan', planSchema);

planSchema.index({planId: 1}, { unique: true });

async function findAndDelete(tableName,data) { 
  let deletedPlan = await Plan.findOne({[tableName]: data})
  return  deletedPlan ? Plan.deleteOne(deletedPlan) : null;
}

module.exports = {Plan,findAndDelete};
