const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: Number,
  name: String,
  price: {
    type: mongoose.Decimal128
  },
  description: String,
  type: String,
  stock: Number,
  image: String,
}, {collection: 'Product'});

ProductSchema.methods.toJSON = function() {
  const product = this.toObject();
  delete product.__v;
  return product;
};

const Product = mongoose.model('Product', ProductSchema);


module.exports = Product;
