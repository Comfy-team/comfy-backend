const mongoose = require("mongoose");

const schema = mongoose.Schema;

const ordersSchema = new schema({
  _id: { type: mongoose.Types.ObjectId, auto: true },
  cartId: {type:mongoose.Types.ObjectId,ref:"carts"},
  address:[{type:Object,ref:"users"}],
  phone:[{type:Number,ref:"users"}],
  date: { type: Date, default: Date.now }

});

module.exports = mongoose.model("orders", ordersSchema);
// orders  are the name of collection