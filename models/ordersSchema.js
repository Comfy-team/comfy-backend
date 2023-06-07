const mongoose = require("mongoose");

const schema = mongoose.Schema;

const addressSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    building: {
      type: Number,
      required: true,
      min: 1,
    },
    governorate: {
      type: String,
      required: true,
    },
    apartment: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const ordersSchema = new schema({
  userId: { type: mongoose.Types.ObjectId, ref: "users" },
  _id: { type: mongoose.Types.ObjectId, auto: true },
  cartId: { type: mongoose.Types.ObjectId, ref: "carts" },
  address: {
    type: addressSchema,
  },
  phone: { type: Number, ref: "users" , required:true,}, //i confused if i should make phone sting or number 

  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("orders", ordersSchema);
// orders  are the name of collection




