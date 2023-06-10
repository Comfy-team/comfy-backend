const mongoose = require("mongoose");
require("../models/cartSchema");

const Cart = mongoose.model("cart");

module.exports.getAllCarts = (req, res, next) => {
  Cart.find()
    .then((carts) => {
      res.status(200).json(carts);
    })
    .catch((error) => next(error));
};

module.exports.getCartById = (req, res, next) => {
  Cart.findOne({ _id: req.params.id })
    .then((cart) => {
      if (cart == null) {
        throw new Error("Cart not found");
      }
      res.status(200).json(cart);
    })
    .catch((error) => next(error));
};

exports.postProductToCart = (req, res, next) => {
  const { product_id, color, price } = req.body;
  const { id } = req.params;
  const quantity = 1;

  Cart.findOne({ _id: id })
    .populate('items.product')
    .then((cart) => {
      if (cart == null) {
        throw new Error("Cart not found");
      }
      const existingProductIndex = cart.items.findIndex(
        (item) => item.product && item.product._id.toString() === product_id && item.color === color
      );
      if (existingProductIndex !== -1) {
        cart.items[existingProductIndex].quantity += quantity;
      } else {
        cart.items.push({ product_id: product_id, quantity, color, price });
      }
      cart.totalPrice = cart.items.reduce((total, item) => {
        const item_price = item.price * item.quantity;
        return total + item_price;
      }, 0);
      return cart.save();
    })
    .then((cart) => {
      res.status(200).json(cart);
    })
    .catch((error) => next(error));
};

exports.updateProductInCart = (req, res, next) => {
  const { cartId } = req.params;
  const { itemId, quantity } = req.body;

  Cart.findOne({ _id: cartId })
    .then((cart) => {
      const item = cart.items.find((item) => item._id.toString() === itemId);
      if (!item) {
        throw new Error("Item not found in cart");
      }
      const oldQuantity = item.quantity;
      item.quantity = quantity;
      return cart.save();
    })
    .then((cart) => {
      cart.totalPrice = cart.items.reduce((total, item) => {
        if (!isNaN(item.price)) {
          const item_price = item.price * item.quantity;
          return total + item_price;
        } else {
          return total;
        }
      }, 0);
      return cart.save();
    })
    .then((cart) => {
      res.status(200).json(cart);
    })
    .catch((error) => next(error));
};

module.exports.deleteProductFromCart = (req, res, next) => {
  const { itemId } = req.body;
  const { id } = req.params;

  Cart.findOne({ _id: id })
    .populate('items.product')
    .then((cart) => {
      if (!cart) {
        throw new Error('Cart not found');
      }

      const item = cart.items.find((item) => item._id.toString() === itemId);
      if (!item) {
        throw new Error('Item not found in cart');
      }

      cart.items.pull(itemId);

      const item_price = item.price * item.quantity;
      cart.totalPrice -= item_price;

      return cart.save();
    })
    .then((cart) => {
      res.status(200).json({ msg: 'Product deleted successfully' });
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
      cart.totalPrice = 0;

      for (const item of cart.items) {
        cart.totalPrice += item.price * item.quantity;
      }

      return cart.save();
    })
    .then((cart) => {
      res.status(200).json(cart);
    })
    .catch((error) => next(error));
};