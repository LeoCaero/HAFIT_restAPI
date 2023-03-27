const express = require("express");
const Product = require("../models/product");

const router = express.Router();

module.exports = router;

/**
 * @swagger
 * /api/products:
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
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     parameters:
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
 *     security:
 *       - BearerAuth: []
 */
router.post("/add", async (req, res) => {
  try {
    const { name, price, description, type, stock, image } = req.body;
    const product = new Product({
      name,
      price,
      description,
      type,
      stock,
      image,
    });
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const products = req.body;
    const newProducts = await Product.insertMany(products);
    res.status(201).json(newProducts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

