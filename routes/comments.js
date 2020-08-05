const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const User = require("../models/user");
const db = require("../configs/database");

router.post('/', async (req, res) => {
	let userId = req.session.userId || null;
	if(userId){
		await newComment(userId, req.body);
    	res.status(200).json({
      		message: 'Commented successfully',
      		status: 'Success'
    	});
	}else{
		res.status(400).json({
      		message: 'Log in to comment',
      		status: 'Fail'
    	});
	}
});

async function newComment(userId, body) {
  let comment = new Comment();

  comment.userId = userId;
  comment.productId = body.productId;
  comment.rating = body.rating;
  comment.content = body.content;

  await comment.save();
}

router.get('/', async (req, res) => {
	let comments = await Comment.find();
	res.status(200).json(comments);
});

router.get('/:productId', async (req, res) => {
	let output = [];

	let comments = await Comment.find({ productId: req.params.productId }).select('userId content rating updated_at').cursor()
		.eachAsync(async function(doc, i){
			var obj = doc.toObject();
			let userFullname = await User.findById(doc.userId).select('fullname');
			obj.fullname = userFullname.fullname;
			output.push(obj);
			console.log(obj);
		});

	res.status(200).json(output);
});

module.exports = router;

