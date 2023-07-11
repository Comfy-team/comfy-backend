const mongoose = require("mongoose");

const { getDataOfPage } = require("./paginationController");
require("../models/productSchema");

require("../models/ordersSchema");
const Orders = mongoose.model("orders");
const Product = mongoose.model("products");
const User = mongoose.model("users");

exports.getAllOrders = (req, res, next) => {
  Orders.find({})
    .then(data => {
      // handle pagination
      const page = req.query.page ? req.query.page : 1;
      const { totalPages, pageData } = getDataOfPage(data, page);
      res
        .status(200)
        .json({ data: pageData, totalPages, totalOrders: data.length });
    })
    .catch(error => next(error));
};

module.exports.searchForOrder = (req, res, next) => {
  Orders.find({})
    .then(data => {
      const arr = data.filter(ele => {
        return (
          ele.totalPrice === +req.query.search ||
          ele.userId
            .toString()
            .toLowerCase()
            .includes(req.query.search.toLowerCase()) ||
          ele._id
            .toString()
            .toLowerCase()
            .includes(req.query.search.toLowerCase())
        );
      });

      return arr;
    })
    .then(data => {
      const page = req.query.page ? req.query.page : 1;
      const { totalPages, pageData } = getDataOfPage(data, page);
      res.status(200).json({
        data: pageData,
        totalPages,
        totalOrders: data.length,
      });
    })
    .catch(error => next(error));
};

exports.postOrders = async (req, res, next) => {
  try {
    const order = new Orders({
      userId: req.body.userId,
      address: req.body.address,
      phone: req.body.phone,
      items: req.body.items,
      totalPrice: req.body.totalPrice,
    });
    for (const item of order.items) {
      const color = item?.color;
      const product = await Product.findOne({ _id: item.product_id._id });
      if (!product) {
        throw new Error(`Product not found with _id: ${item.product_id._id}`);
      }
      const colorObject = product.colors.find(c => c.color === color);
      if (!colorObject || colorObject.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      colorObject.stock -= item.quantity;
      await product.save();
    }

    const savedOrder = await order.save();

    await User.updateOne(
      { _id: savedOrder.userId },
      { $push: { order: savedOrder._id } }
    );

    res.status(201).json(savedOrder);
  } catch (error) {
    next(error);
  }
};

exports.getSingleOrders = (req, res, next) => {
  Orders.findOne({ _id: req.params.id })
    .populate({
      path: "userId",
      select: { fullName: 1 },
    })
    .then(order => {
      if (order == null) {
        throw new Error("order not found");
      }
      res.status(200).json(order);
    })
    .catch(error => next(error));
};

exports.deleteSingleOrders = (req, res, next) => {
  Orders.findOne({ _id: req.params.id })
    .then(Order => {
      if (!Order) {
        throw new Error("Order not found with the specified _id value");
      }
      Order.items.forEach(items => {
        Product.findOneAndUpdate(
          { _id: items.product_id._id },
          { $inc: { "colors.0.stock": items.quantity } }
        )
          .then(product => {
            if (!product) {
              throw new Error(
                `product not found with this specific _id value :${item.product}`
              );
            }
          })
          .catch(error => {
            throw new Error(`error updating product stock ${error.message}`);
          });
      });
      User.findOneAndUpdate(
        { _id: Order.userId },
        { $pull: { order: Order._id } }
      )
        .then(data => {
          // console.log(data);
        })
        .catch(error => {
          return Promise.reject(
            new Error(`error delete order from user ${error.message}`)
          );
        });
      return Order.deleteOne({ _id: req.params.id });
    })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => next(error));
};
