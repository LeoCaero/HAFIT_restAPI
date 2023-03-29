const mongoose = require("mongoose");
  

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
}, { collection: 'Plan' });


const Plan = mongoose.model('Plan', planSchema);

planSchema.index({planId: 1}, { unique: true });

async function findAndDelete(tableName,data) { 
  let deletedPlan = await Plan.findOne({[tableName]: data})
  return  deletedPlan ? Plan.deleteOne(deletedPlan) : null;
}

module.exports = {Plan,findAndDelete};
