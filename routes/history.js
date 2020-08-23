const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Product = require("../models/product");

router.get('/', async (req, res) => {
	let userId = req.session.userId || null;
	if(userId){
		getHistory(userId, res);
	}else{
		res.status(400).json({
      		message: 'Log in to comment',
      		status: 'Fail'
    	});
	}
});

async function getHistory(userId, res){
	let output = [];

	let carts = await Cart.find({userId: userId, status: 1}).select('total products updated_at').cursor()
	.eachAsync(async function(doc, i){
		var obj = doc.toObject();
		for (index = 0; index < obj.products.length; index++) { 
			let productName = await Product.findById(obj.products[index].id).select('name');
			obj.products[index].name = productName.name;
		} 
		output.push(obj);
	});

	res.status(200).json(output);
}

module.exports = router;