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
  cartId: { type: mongoose.Types.ObjectId, ref: "cart" },
  address: {
    type: addressSchema,
  },
  phone: { type: String, ref: "users" , required:true,},

  date: { type: Date, default: Date.now },
});

mongoose.model("orders", ordersSchema);
