const Orders = require("../models/ordersSchema");

exports.getAllOrders = (req, res, next) => {
  Orders.find({})
    .then(data => {
      // res.send("get all orders")
      res.status(200).json({ data });
    })
    .catch(error => next(error));
};

exports.postOrders = (req, res, next) => {
  // res.send("postOrders orders")

  const object = new Orders({
    cartId: req.body.cartId,
    address: req.body.address,
    phone: req.body.phone,
    date: req.body.date,
  });
  object
    .save()
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => next(error));

  //   res.send(res.body);
  console.log(res);
};

exports.deleteSingleOrders = (req, res) => {
  res.send("deleteSingleOrders orders");
};

exports.updateSingleOrders = (req, res) => {
  res.send("updateSingleOrders orders");
};
exports.getSingleOrders = (req, res, next) => {
  Orders.findOne({ _id: req.params.id })
    .then(data => {
      if (data == null) {
        throw new Error("not id in list");
      } else {
        res.json(data);
      }
    })
    .catch(error => next(error));
};
