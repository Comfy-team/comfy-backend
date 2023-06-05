const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: String,
  category: String,
  image: String,
  products: { type: [mongoose.Schema.Types.ObjectId], ref: "products" },
});

mongoose.model("brands", schema);
