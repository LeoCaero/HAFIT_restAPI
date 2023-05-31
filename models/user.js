const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./product");
const Plan = require("../models/plan");
const Exercice = require("../models/exercice");

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
      minlength: 2,
      maxlength: 15,
    },
    biography: {
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
        unique: true,
      },
    ],
    plans: [
      {
        type: Schema.Types.ObjectId,
        ref: "Plan",
        required: false,
        unique: false,
      },
    ],
    exercices: [
      {
        type: Exercice.schema,
        ref: "Exercice",
        required: false,
        unique: false,
      },
    ],
    auth_token: {
      type: String,
      required: false,
    },
  },
  { collection: "User" }
);

// Función de pre-guardado para autoincrementar el campo userId
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isNew) {
    User.findOne()
      .sort("-userId")
      .exec()
      .then((lastUser) => {
        user.userId = lastUser ? lastUser.userId + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
});

// Opciones de validación para el campo plans
userSchema.path("plans").validate(function (value) {
  // Verificar si el valor es un arreglo válido
  if (!Array.isArray(value)) {
    return false;
  }

  // Verificar si todos los elementos son ObjectId válidos
  return value.every((element) => mongoose.Types.ObjectId.isValid(element));
}, 'El campo "plans" debe ser un arreglo de ObjectIds válidos.');

const User = mongoose.model("User", userSchema);

module.exports = User;