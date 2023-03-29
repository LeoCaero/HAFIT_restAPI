const express = require("express");
const Product = require("../models/product");
const { searchBy } = require("../controllers/controller");

const fs = require("fs"); // TO DO


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
 *     consumes:
 *       - multipart/form-data
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: price
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: description
 *         required: false
 *         schema:
 *           type: string
 *           default:  
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ "supplement", "cloth"]
 *       - in: query
 *         name: stock
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: image
 *         required: false
 *         schema:
 *           type: file
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
    const { name, price, description, type, stock, image} = req.query;
    console.log(image);
    const imageBuffer = fs.readFileSync(req.file);
    const base64Image = imageBuffer.toString("base64");

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

router.post("/bulk", async (req, res) => {
  try {
    const products = req.body;
    const newProducts = await Product.insertMany(products);
    res.status(201).json(newProducts);
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