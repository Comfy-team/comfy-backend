const mongoose = require("mongoose");

require("../models/ordersSchema");

const Orders = mongoose.model("orders");
const User = mongoose.model("users");

exports.getAllOrders = (req, res, next) => {
  Orders.find({})
    .then(data => {
      // res.send("get all orders")
      res.status(200).json({ data });
    })
    .catch(error => next(error));
};

exports.postOrders = (req, res, next) => {
  const object = new Orders({
    userId: req.body.userId,
    cartId: req.body.cartId,
    address: req.body.address,
    phone: req.body.phone,
  });
  object.save().
  then(async data => {
    await User.updateOne({ _id: data.userId }, { $set: { order: data._id } });
    return data;
  })
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => next(error));

  //   res.send(res.body);
  console.log(res);
};

exports.getSingleOrders = (req, res, next) => {
  Orders.findOne({ _id: req.params.id })
    .then(data => {
      if (data == null) {
        throw new Error("order not found");
      } else {
        res.json(data);
      }
    })
    .catch(error => next(error));
};

exports.deleteSingleOrders = (req, res, next) => {
  Orders.findOne({ _id: req.body.id })
    .then(Order => {
      if (!Order) {
        throw new Error("Order not found with the specified _id value");
      }
      return Order.deleteOne({ _id: req.body.id });
    })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => next(error));
};