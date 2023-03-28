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

// Configuramos la auto-incrementación de la propiedad "id" usando Mongoose's pre-save hook
ProductSchema.pre('save', function (next) {
  const doc = this;
  mongoose
    .model('Product', ProductSchema)
    .countDocuments({}, function (err, count) {
      if (err) {
        return next(err);
      }
      doc.productId = count + 1;
      next();
    });
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
