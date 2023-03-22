const express = require('express');
const Product = require('../models/product');

const router = express.Router();

module.exports = router;


// GET PRODUCTS
router.get('/products', async (req, res) => {
    try{
        const data = await Product.find();
        res.json(data);
    }   
    catch(error){
        res.status(500).json({message: error.message})
    }
})



