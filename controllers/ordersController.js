const mongoose = require("mongoose");

require("../models/ordersSchema");
const { getDataOfPage } = require("./paginationController");
const dataPerPage = 5;

const Orders = mongoose.model("orders");
const User = mongoose.model("users");

exports.getAllOrders = (req, res, next) => {
  Orders.find({})
    .then(data => {
      // handle pagination
      const page = req.query.page ? req.query.page : 1;
      const { totalPages, pageData } = getDataOfPage(data, page, dataPerPage);
      res.status(200).json({ data: pageData, totalPages });
    })
    .catch(error => next(error));
};

module.exports.searchForOrder = (req, res, next) => {
  Orders.find({})
    .then(data => {
      const arr = data.filter(ele => {
        return ele._id
          .toString()
          .toLowerCase()
          .includes(req.query.search.toLowerCase());
      });
      return arr;
    })
    .then(data => {
      const page = req.query.page ? req.query.page : 1;
      const { totalPages, pageData } = getDataOfPage(data, page, dataPerPage);
      res.status(200).json({
        data: pageData,
        totalPages,
      });
    })
    .catch(error => next(error));
};

exports.postOrders = (req, res, next) => {
  const object = new Orders({
    userId: req.body.userId,
    address: req.body.address,
    phone: req.body.phone,
    items: req.body.items,
    totalPrice: req.body.totalPrice,
  });
  object
    .save()
    .then(async data => {
      await User.updateOne(
        { _id: data.userId },
        { $push: { order: data._id } }
      );
      return data;
    })
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => next(error));
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
  Orders.findOne({ _id: req.params.id })
    .then(Order => {
      if (!Order) {
        throw new Error("Order not found with the specified _id value");
      }
      return Order.deleteOne({ _id: req.params.id });
    })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => next(error));
};
