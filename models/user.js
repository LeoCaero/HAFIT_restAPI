const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./product");

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
      }
    ]
  },
  { collection: "User" }
);

// AUTOINCREMENT
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isNew) {
    return User.findOne()
      .sort("-userId")
      .exec()
      .then(lastUser => {
        user.userId = lastUser ? lastUser.userId + 1 : 1;
      })
      .catch(err => {
        throw err;
      });
  } else {
    return Promise.resolve();
  }
});


const User = mongoose.model("User", userSchema);



module.exports = User;


