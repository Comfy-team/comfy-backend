const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = +process.env.saltRounds;
const salt = bcrypt.genSaltSync(saltRounds);

const User = mongoose.model("users");
const Cart = mongoose.model("cart");

module.exports.register = (request, response, next) => {
  let object = new User({
    fullName: request.body.fullName,
    password: bcrypt.hashSync(request.body.password, salt),
    email: request.body.email,
    phone: request.body.phone || "",
    address: request.body.address,
  });

  object
    .save()
    .then((data) => {
      let cartObj = new Cart({
        user_id: data._id,
        items: [],
      });
      return cartObj.save();
    })
    .then(async (data) => {
      await User.updateOne(
        { _id: data.user_id },
        { $set: { cart_id: data._id } }
      );
      return User.findOne({ _id: data.user_id });
    })
    .then((data) => {
      response.status(201).json(data);
    })
    .catch((error) => next(error));
};
