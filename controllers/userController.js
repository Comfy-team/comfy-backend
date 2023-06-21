const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { populate } = require("../models/cartSchema");

const saltRounds = process.env.saltRounds;
const salt = bcrypt.genSaltSync(saltRounds);

require("../models/userSchema");
const Cart = mongoose.model("cart");
const User = mongoose.model("users");

module.exports.getAllUsers = (request, response, next) => {
  User.find({})
    .then((data) => response.status(200).json(data))
    .catch((error) => next(error));
};

module.exports.getUserById = (request, response, next) => {
  User.findOne({ _id: request.params.id })
    .then((object) => {
      if (object == null) {
        throw new Error("user isn't found");
      }
      response.status(200).json(object);
    })
    .catch((error) => next(error));
};

module.exports.updateUser = (request, response, next) => {
  const { currentPassword } = request.body;

  let password;
  if (request.body.password != undefined) {
    password = bcrypt.hashSync(request.body.password, salt);
  }

  User.findOne({ _id: request.body.id })
    .then((user) => {
      if (request.body.currentPassword !== undefined) {
        const isCurrentPasswordValid = bcrypt.compareSync(
          request.body.currentPassword,
          user.password
        );
        if (!isCurrentPasswordValid) {
          throw new Error("Current password is incorrect");
        }
      }
      if (
        user &&
        request.body.password &&
        bcrypt.compareSync(request.body.password, user.password)
      ) {
        throw new Error("Password must be different from the current password");
      } else {
        return User.updateOne(
          { _id: request.body.id },
          {
            $set: {
              fullName: request.body.fullName,
              password: password,
              email: request.body.email,
              phone: request.body.phone,
              "address.city": request.body.address?.city,
              "address.street": request.body.address?.street,
              "address.building": request.body.address?.building,
              "address.governorate": request.body.address?.governorate,
              "address.apartment": request.body.address?.apartment,
              "address.postalCode": request.body.address?.postalCode,
            },
          }
        );
      }
    })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.deleteUser = (request, response, next) => {
  User.findOne({ _id: request.body.id })
    .then((user) => {
      if (!user) {
        throw new Error("user not found with the specified _id value");
      }
      return User.deleteOne({ _id: request.body.id });
    })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.getUserCart = (request, response, next) => {
  User.find({ _id: request.params.id }, { _id: 0, cart_id: 1 })
    .populate({
      path: "cart_id",
      populate: {
        path: "items.product_id",
        select: { name: 1, images: 1, brand: 1 },
        populate: {
          path: "brand",
          select: { name: 1 },
        },
      },
    })
    .then((data) => {
      response.status(200).json(data[0]["cart_id"]);
    })
    .catch((error) => next(error));
};

module.exports.getUserOrders = (request, response, next) => {
  User.find({ _id: request.params.id }, { _id: 0, order: 1 })
    .populate({
      path: "order",
      select: { date: 1, userId: 1, cartId: 1 },
      populate: {
        path: "cartId",
        select: { totalPrice: 1, items: 1 },
        populate: {
          path: "items.product_id",
          select: { name: 1, images: 1, brand: 1 },
          populate: {
            path: "brand",
            select: { name: 1 },
          },
        },
      },
    })
    .then((data) => {
      response.status(200).json(data[0]["order"]);
    })
    .catch((error) => next(error));
};

module.exports.getAllUsersOrders = (request, response, next) => {
  User.find({ order: { $exists: true, $ne: [] } }, { fullName: 1 })
    .populate({ path: "order" })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};
