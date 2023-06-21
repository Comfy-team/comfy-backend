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
  colors: [String],
  discount: Number,
  stock: Number,
  category: {type:mongoose.Schema.Types.ObjectId, ref:"categories"},
  brand: {type:mongoose.Schema.Types.ObjectId, ref:"brands"},
});

mongoose.model("products", schema);