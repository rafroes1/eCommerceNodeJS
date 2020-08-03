const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId: String,
  productId: String,
  rating: { type: Number, default: 0 },
  image: String,
  content: String
}, 
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model("Comment", commentSchema);
