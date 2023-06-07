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
  const object = new Orders({
    userId: req.body.userId,
    cartId: req.body.cartId,
    address: req.body.address,
    phone: req.body.phone,
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

exports.updateSingleOrders = (req, res) => {
  // res.send("updateSingleOrders orders");

  Orders.updateOne(
    { _id: req.body.id },
    {
      $set: {
        userId: req.body.userId,
        phone: req.body.phone,
        cartId: req.body.cartId,
        "address.city": req.body.address.city,
        "address.street": req.body.address.street,
        "address.building": req.body.address.building,
        "address.governorate": req.body.address.governorate,
        "address.apartment": req.body.address.apartment,
        "address.postalCode": req.body.address.postalCode,
      },
    }
  )
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => next(error));
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
