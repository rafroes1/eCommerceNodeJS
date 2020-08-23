const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const User = require("../models/user");
const Cart = require("../models/cart");

router.post('/', async (req, res) => {
	let userId = req.session.userId || null;
	let hasCart = null;
	if(userId){
		hasCart = await canComment(userId, req.body.productId);
		if(hasCart){
			await newComment(userId, req.body);
    		res.status(200).json({
      			message: 'Commented successfully',
      			status: 'Success'
    		});
		}else{
			res.status(400).json({
      			message: 'You cant comment if you haven\'t bought the product',
      			status: 'Fail'
    		});
		}
	}else{
		res.status(400).json({
      		message: 'Log in to comment',
      		status: 'Fail'
    	});
	}
});

async function canComment(userId, productId){
	let cart = Cart.findOne({userId: userId, status: 3, "products.id": productId});
	return cart;
}

async function newComment(userId, body) {
  let comment = new Comment();

  comment.userId = userId;
  comment.productId = body.productId;
  comment.rating = body.rating;
  comment.content = body.content;

  await comment.save();
}

router.get('/', async (req, res) => {
	let output = [];

	let comments = await Comment.find().select('userId productId content rating updated_at').cursor().eachAsync(async function(doc, i){
		var obj = doc.toObject();
		let userFullname = await User.findById(doc.userId).select('fullname');
		obj.fullname = userFullname.fullname;
		output.push(obj);
	});

	res.status(200).json(output);
});

router.get('/:productId', async (req, res) => {
	let output = [];

	let comments = await Comment.find({ productId: req.params.productId }).select('userId content rating updated_at').cursor()
		.eachAsync(async function(doc, i){
			var obj = doc.toObject();
			let userFullname = await User.findById(doc.userId).select('fullname');
			obj.fullname = userFullname.fullname;
			output.push(obj);
		});

	res.status(200).json(output);
});

module.exports = router;

