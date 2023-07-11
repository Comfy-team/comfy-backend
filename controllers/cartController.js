const mongoose = require("mongoose");
require("../models/cartSchema");

const Cart = mongoose.model("cart");

const calculateTotalPrice = (products) => {
  const totalPrice = products.reduce((total, item) => {
    const itemStock = item.product_id.colors.find(ele => ele.color === item.color)?.stock || 0;
    if (itemStock > 0) {
      const itemPrice = item.product_id.price * item.quantity * (1 - item.product_id.discount / 100);
      return total + itemPrice;
    } else {
      return total;
    }
  }, 0);
  return totalPrice.toFixed(2);
};

module.exports.getAllCarts = (req, res, next) => {
  Cart.find()
    .then((carts) => {
      res.status(200).json(carts);
    })
    .catch((error) => next(error));
};

module.exports.getCartById = (req, res, next) => {
  Cart.findOne({ _id: req.params.id })
    .populate({
      path: "items.product_id",
      select: { name: 1, images: 1, price: 1, discount: 1, colors: 1 },
    })
    .then((cart) => {
      if (cart == null) {
        throw new Error("Cart not found");
      }
      const totalPrice =
        cart.items.length > 0 ? calculateTotalPrice(cart.items) : 0;
      res.status(200).json({ ...cart._doc, totalPrice });
    })
    .catch((error) => next(error));
};

exports.postProductToCart = (req, res, next) => {
  const { product_id, color } = req.body;
  const { id } = req.params;
  const quantity = 1;

  Cart.findOne({ _id: id })
    .populate({
      path: "items.product_id",
      select: { name: 1, images: 1, price: 1, discount: 1, colors: 1 },
    }).then((cart) => {
      if (cart == null) {
        throw new Error("Cart not found");
      }
      cart.items.push({
        product_id,
        quantity,
        color,
      });
      return cart.save();
    })
    .then((cart) => {
      res.status(201).json(cart);
    })
    .catch((error) => next(error));
};

exports.updateProductInCart = (req, res, next) => {
  let totalPrice;
  Cart.findOne({ _id: req.params.cartId })
    .populate({
      path: "items.product_id",
      select: { name: 1, images: 1, price: 1, discount: 1, colors: 1 },
    }).then((cart) => {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product_id._id.toString() === req.body.itemId &&
          item.color === req.body.color
      );
      cart.items[itemIndex].quantity = req.body.quantity;
      totalPrice = cart.items.length > 0 ? calculateTotalPrice(cart.items) : 0;
      return cart.save();
    })
    .then((cart) => {
      res.status(200).json({ ...cart._doc, totalPrice });
    })
    .catch((error) => next(error));
};

module.exports.deleteProductFromCart = (req, res, next) => {
  let totalPrice;
  Cart.findOne({ _id: req.params.id })
    .populate({
      path: "items.product_id",
      select: { name: 1, images: 1, price: 1, discount: 1, colors: 1 },
    }).then((cart) => {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product_id._id.toString() === req.body.itemId &&
          item.color === req.body.color
      );
      cart.items.splice(itemIndex, 1);
      totalPrice = cart.items.length > 0 ? calculateTotalPrice(cart.items) : 0;
      return cart.save();
    })
    .then((cart) => {
      res.status(200).json({ ...cart._doc, totalPrice });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.emptyCart = (req, res, next) => {
  const { id } = req.params;
  Cart.findOne({ _id: id })
    .then((cart) => {
      if (cart == null) {
        throw new Error("Cart not found");
      }
      cart.items = [];
      return cart.save();
    })
    .then((cart) => {
      res.status(200).json({ ...cart._doc, totalPrice: 0 });
    })
    .catch((error) => next(error));
};
