const mongoose=require("mongoose");

require("../models/cartSchema");
const Cart = mongoose.model('cart')
exports.getAllCarts = (req, res) => {
  Cart.find()
    .then((carts) => res.status(200).json(carts))
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.getCartById = (req, res) => {
  Cart.findById(req.params.id)
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.status(200).json(cart);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

// exports.postProductToCart = (req, res) => {
//   const { user_id, product_id, quantity, color } = req.body;
//   Cart.findOne({ user_id })
//     .then((cart) => {
//       if (!cart) {
//         cart = new Cart({
//           user_id,
//           totalPrice: 0,
//           items: [],
//         });
//       }
//       const itemIndex = cart.items.findIndex((item) => item.product_id.toString() === product_id);
//       if (itemIndex === -1) {
//         cart.items.push({ product_id, quantity, color });
//       } else {
//         cart.items[itemIndex].quantity += quantity;
//       }
//       cart.totalPrice += quantity;
//       return cart.save();
//     })
//     .then((cart) => res.status(201).json(cart))
//     .catch((err) => res.status(500).json({ message: err.message }));
// };

exports.updateProductInCart = (req, res) => {
  const { product_id, quantity, color } = req.body;
  Cart.findById(req.params.id)
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      const itemIndex = cart.items.findIndex((item) => item.product_id.toString() === product_id);
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].color = color;
      cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity, 0);
      return cart.save();
    })
    .then((cart) => res.status(200).json(cart))
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.deleteProductFromCart = (req, res) => {
  const { product_id } = req.body;
  Cart.findById(req.params.id)
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      const itemIndex= cart.items.findIndex((item) => item.product_id.toString() === product_id);
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
      const deletedItem = cart.items.splice(itemIndex, 1)[0];
      cart.totalPrice -= deletedItem.quantity;
      return cart.save();
    })
    .then((cart) => res.status(200).json(cart))
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.emptyCart = (req, res) => {
  const { cart_id } = req.body;
  Cart.findById(cart_id)
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      cart.totalPrice = 0;
      cart.items = [];
      return cart.save();
    })
    .then((cart) => res.status(200).json(cart))
    .catch((err) => res.status(500).json({ message: err.message }));
};