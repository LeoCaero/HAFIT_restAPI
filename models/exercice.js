const mongoose = require("mongoose");


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
  }
}, { collection: 'Exercice' });


const Exercice = mongoose.model('Exercice', exerciceSchema);


module.exports = Exercice;