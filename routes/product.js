const express = require("express");
const Product = require("../models/product");
const { searchBy, deleteBy } = require("../controllers/controller");

const fs = require("fs"); // TO DO

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

module.exports = router;

/**
 * @swagger
 * /api/product/all:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     description: Get all products stored in the database
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */
router.get("/all", async (req, res) => {
  try {
    const data = await Product.find();
    // data.forEach(product => product.image = product.image.substring(0,40) + '...');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/**
 * @swagger
 * /api/product/add:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '201':
 *         description: Created a new product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Bad request. Invalid input or missing required field(s).
 *         content:
 *           application/json:
 *             example:
 *               message: Error message explaining the issue
 */
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, type, stock, image } = req.body;
    const product = new Product({
      name,
      price,
      description,
      type,
      stock,
      image: base64Image, 
    });
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/product/search:
 *   get:
 *     summary: Get product by X
 *     tags: [Products]
 *     description: Get a product by the selected option
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           enum: [ "_id", "productId","name", "type", "stock"]
 *         description: "Search product by"
 *         required: true
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *         required: true
 *         description: The data of the product to retrieve
 *     responses:
 *       200:
 *         description: A product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/search", async (req, res) => {
  await searchBy(Product, req, res);
});

/**
 * @swagger
 * /api/product/delete:
 *   delete:
 *     summary: Delete product by X
 *     tags: [Products]
 *     description: Delete a product by the selected option
 *     parameters:
 *       - in: query
 *         name: deleteBy
 *         schema:
 *           type: string
 *           enum: ["_id", "productId","name", "type", "stock"]
 *         description: "Delete product by"
 *         required: true
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *         required: true
 *         description: The data of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete", async (req, res) => {
  await deleteBy(Product, req, res);
});

/**
 * @swagger
 * /api/product/search:
 *   get:
 *     summary: Get product by X
 *     tags: [Products]
 *     description: Get a product by the selected option
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           enum: [ "_id", "productId","name", "type", "stock"]
 *         description: "Search product by"
 *         required: true
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *         required: true
 *         description: The data of the product to retrieve
 *     responses:
 *       200:
 *         description: A product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/search", async (req, res) => {
  await searchBy(Product, req, res);
});