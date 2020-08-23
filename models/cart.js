const mongoose = require("mongoose");
const product = require("./product");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: { type: String, default: null },
  couponId: { type: String, default: null },
  total: { type: Number, default: 0 },
  fullname: String,
  phone: String,
  address: String,
  status: { type: Number, default: 1 },
  products: [{ _id: false, id: String, quantities: Number, price: Number, shippingCost: Number, image: String }]
}, 
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model("Cart", cartSchema);
