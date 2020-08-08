const express = require("express");
const router = express.Router();
const Product = require("../models/product");


    // get all products
    
    router.get('/', async (req, res) => {
  
    await Product.find({}, function(err, result){
        console.log(result);
        res.status(200).json(result);
    });
  });

    
  // get products by typing its product name

  router.get('/:productId', async (req, res) => {

    const productName = req.params['productId'];
    console.log(productName);
     await Product.findOne({ name: productName }, function(err, result){
        console.log(result);
        res.status(200).json(result);
    });
  });

module.exports = router;
