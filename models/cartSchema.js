const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount:{
    type:Number,
    required:true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products"
  },
});

const schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  items: {
    type: [cartItemSchema],
    required: true,
  },
});

module.exports = mongoose.model("cart", schema);