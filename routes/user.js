const express = require("express");
const router = express.Router();
const User = require("../models/user");
const errors = require("../utils/errorMessages");
const { searchBy, deleteBy, editBy } = require("../controllers/controller");

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
    const { name, email, type } =  req.body;

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
