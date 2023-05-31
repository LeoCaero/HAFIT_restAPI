const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Plan = require("../models/plan");
const Exercice = require("../models/exercice");
const errors = require("../utils/errorMessages");
const { searchBy, deleteBy, editBy, autoincrement, editType } = require("../controllers/controller");
const Product = require("../models/product");
const { verifyToken, testHandler } = require('./token');

module.exports = router;

/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: Get ALL users
 *     tags: [Users]
 *     description: Get all users stored in the database
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get("/all", verifyToken, async (req, res, next) => {
  try {
    const data = await User.find();
    req.data = data;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}, testHandler);



/**
 * @swagger
 * /api/user/add:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Create a new user and store it in the database
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: User name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: User email
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ "admin", "client", "soci", "trabajador"]
 *         description: User type
 *         required: true
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post("/add", async (req, res) => {
  try {
    const { name, email, type, auth_token } = req.body;

    const newUser = new User({
      name,
      email,
      type,
      auth_token
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/user/search:
 *   get:
 *     summary: Get user by X
 *     tags: [Users]
 *     description: Get a user by the selected option
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           enum: [ "name", "email", "_id"]
 *         description: "Search user by"
 *         required: true
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *         required: true
 *         description: The data of the user to retrieve
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/search", async (req, res) => {
  await searchBy(User, req, res);
});

/**
 * @swagger
 * /api/user/delete:
 *   delete:
 *     summary: Delete user by X
 *     tags: [Users]
 *     description: Delete a user by the selected option
 *     parameters:
 *       - in: query
 *         name: deleteBy
 *         schema:
 *           type: string
 *           enum: ["name", "email", "_id"]
 *         description: "Delete user by"
 *         required: true
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *         required: true
 *         description: The data of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete", async (req, res) => {
  await deleteBy(User, req, res);
});

/**
 * @swagger
 * /api/user/edit:
 *   put:
 *     summary: Edit user
 *     tags: [Users]
 *     description: Edit a user
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User Id
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: User name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: User email
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ "admin", "client", "soci", "trabajador"]
 *         description: User type
 *         required: true
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/edit", async (req, res) => {
  await editBy(User, req, res);
});

router.put("/editType", async (req, res) => {
  await editType(User, req, res);
});

router.put("/cart", async (req, res) => {
  try {
    const { userId, productId, action, quantity } = req.body;

    if (!userId || !productId || !action || !quantity) {
      throw new Error("Parámetros de entrada inválidos");
    }

    const product = await Product.findOne({ productId });

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const user = await User.findOne({ userId });

    const itemIndex = user.cartItems.findIndex(
      (item) => item.productId === productId
    );

    if (action === "add") {
      if (itemIndex >= 0) {
        user.cartItems[itemIndex].quantity += quantity;
      } else {
        const cartItem = { ...product.toObject(), quantity };
        user.cartItems.push(cartItem);
      }
    } else if (action === "remove") {
      if (itemIndex >= 0) {
        user.cartItems[itemIndex].quantity -= quantity;
        if (user.cartItems[itemIndex].quantity <= 0) {
          user.cartItems.splice(itemIndex, 1); 
        }
      } else {
        throw new Error("El producto no está en el carrito");
      }
    } else {
      throw new Error("Acción no válida");
    }

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.put("/plans", async (req, res) => {
  try {
    const { userId, planId } = req.body;
    const plan = await Plan.find({ planId: planId });
    console.log(plan)
    if (!plan) {
      throw new Error("Plan no encontrado");
    }

    const user = await User.findOneAndUpdate({ userId: userId }, { $push: { plans: plan } }, { new: true });
    console.log(user)
    updatedUser = await user.save();

    res.status(200).json(`User updated: ${updatedUser}`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/exercices", async (req, res) => {
  try {
    const { userId, exerciceId } = req.body;
    const exercice = await Exercice.find({ exerciceId: exerciceId });
    console.log(exercice)
    if (!exercice) {
      throw new Error("Exercice no encontrado");
    }

    const user = await User.findOneAndUpdate({ userId: userId }, { $push: { exercices: exercice } }, { new: true });
    console.log(user)
    updatedUser = await user.save();

    res.status(200).json(`User updated: ${updatedUser}`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/deletePlans", async (req, res) => {
  try {
    const { userId, planId } = req.body;
    const plan = await Plan.findOne({ planId: planId });
    if (!plan) {
      throw new Error("Plan no encontrado");
    }

    const user = await User.findOneAndUpdate({ userId: userId }, { $pull: { plans: { planId: plan.planId } } }, { new: true });
    console.log(user)
    updatedUser = await user.save();

    res.status(200).json(`User updated: ${updatedUser}`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/deleteExercices", async (req, res) => {
  try {
    const { userId, exerciceId } = req.body;
    const exercice = await Exercice.findOne({ exerciceId: exerciceId });
    if (!exercice) {
      throw new Error("Exercice no encontrado");
    }

    const user = await User.findOneAndUpdate({ userId: userId }, { $pull: { exercices: { exercice: exercice.exerciceId } } }, { new: true });
    console.log(user)
    updatedUser = await user.save();

    res.status(200).json(`User updated: ${updatedUser}`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
