const mongoose = require("mongoose");
const defaultValues = require("../utils/defaultValues");

const exerciceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  exerciceId: {
    type: Number, 
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  time:{
    type: Number
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
}, { collection: 'Exercice' });


const Exercice = mongoose.model('Exercice', exerciceSchema);


module.exports = Exercice;