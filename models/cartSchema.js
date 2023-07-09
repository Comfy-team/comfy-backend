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
});

const schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  items: {
    type: [cartItemSchema],
    required: true,
  },
});

module.exports = mongoose.model("cart", schema);
