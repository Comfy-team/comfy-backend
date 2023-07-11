const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = +process.env.saltRounds;
const salt = bcrypt.genSaltSync(saltRounds);

const { getDataOfPage } = require("./paginationController");

require("../models/userSchema");
const User = mongoose.model("users");
const Cart = mongoose.model("cart");

module.exports.getAllUsers = (request, response, next) => {
  User.find({})
    .then((data) => {
      // handle pagination
      const page = request.query.page ? request.query.page : 1;
      const { totalPages, pageData } = getDataOfPage(data, page);
      response.status(200).json({
        data: pageData,
        totalPages,
        totalUsers: data.length,
      });
    })
    .catch((error) => next(error));
};

module.exports.searchForUser = (request, response, next) => {
  User.find()
    .then((data) => {
      const arr = data.filter((ele) => {
        return (
          ele.email
            .toLowerCase()
            .includes(request.query.search.toLowerCase()) ||
          ele._id
            .toString()
            .toLowerCase()
            .includes(request.query.search.toLowerCase())
        );
      });
      return arr;
    })
    .then((data) => {
      const page = request.query.page ? request.query.page : 1;
      const { totalPages, pageData } = getDataOfPage(data, page);
      response.status(200).json({
        data: pageData,
        totalPages,
        totalUsers: data.length,
      });
    })
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
  // find user if it exist delete it if not show message that user not exist
  User.findOneAndDelete({ _id: request.params.id })
    .then((user) => {
      if (!user) {
        throw new Error("user not found with the specified _id value");
      }
      // delete the user cart
      return Cart.deleteOne({ _id: user.cart_id });
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
        select: {
          name: 1,
          images: 1,
          brand: 1,
          price: 1,
          discount: 1,
          colors: 1,
        },
        populate: {
          path: "brand",
          select: { name: 1 },
        },
      },
    })
    .then((data) => {
      const cart = { ...data[0]["cart_id"]._doc };
      const totalPrice =
        cart.items.length > 0
          ? cart.items.reduce((total, item) => {
              const itemStock =
                item.product_id.colors.find((ele) => ele.color === item.color)
                  ?.stock || 0;
              if (itemStock > 0) {
                const itemPrice =
                  item.product_id.price *
                  item.quantity *
                  (1 - item.product_id.discount / 100);
                return total + itemPrice;
              } else {
                return total;
              }
            }, 0)
          : 0;
      cart.totalPrice = totalPrice.toFixed(2);
      response.status(200).json(cart);
    })
    .catch((error) => next(error));
};

module.exports.getUserOrders = (request, response, next) => {
  User.find({ _id: request.params.id }, { _id: 0, order: 1 })
    .populate({
      path: "order",
      select: { date: 1, userId: 1, items: 1, totalPrice: 1 },
      populate: {
        path: "items.product_id",
        select: { name: 1, images: 1, brand: 1, discount: 1 },
        populate: {
          path: "brand",
          select: { name: 1 },
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
