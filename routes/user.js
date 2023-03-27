const express = require("express");
const router = express.Router();
const User = require("../models/user");
const errors = require("../utils/errorMessages");

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
router.get("/all", async (req, res) => {
  try {
    const data = await User.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
 *         description: User type
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
    const { name, email, type } = req.query;

    const newUser = new User({
      name,
      email,
      type,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



/**
 * @swagger
 * /api/user/email:
 *   get:
 *     summary: Get user by email
 *     tags: [Users]
 *     description: Get a user by their email address
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email address of the user to retrieve
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
router.get("/email", async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        message: errors.notFound.email,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
