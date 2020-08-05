const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
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

module.exports = router;