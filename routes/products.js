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

    const producid = req.params['productId'];
     await Product.findById(producid, function(err, result){
        console.log(result);
        res.status(200).json(result);
    });
  });

module.exports = router;
