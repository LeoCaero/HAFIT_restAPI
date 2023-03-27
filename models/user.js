const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userTypeEnum = ['client', 'admin', 'soci', 'treballador'];

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: userTypeEnum,
    required: true
  }
}, {collection: 'User'});

const User = mongoose.model('User', userSchema);

module.exports = User;
