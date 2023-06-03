const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  src: String,
});

const schema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: String,
  description: String,
  price: Number,
  images: [imageSchema],
  color: String,
  discount: Number,
  stock: Number,
  category: mongoose.Schema.Types.ObjectId,
  brand: mongoose.Schema.Types.ObjectId,
});

mongoose.model("products", schema);
