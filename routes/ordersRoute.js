const express = require("express");

const validator = require("../middlewares/validations/validator");
const OrderValidation = require("../middlewares/validations/ordersValidation");
const controller = require("../controllers/ordersController");
const {
  isAdmin,
  isUserOfIdOrAdmin,
  isUserOrAdmin,
  verifyToken,
} = require("../middlewares/authMw");
const Router = express.Router();

Router.route("/orders")
  .get(verifyToken, isAdmin, controller.getAllOrders)
  .post(
    verifyToken,
    isUserOrAdmin,
    OrderValidation.POSTValidation,
    validator,
    controller.postOrders
  );

Router.route("/orders/search").get(
  OrderValidation.searchValidation,
  validator,
  controller.searchForOrder
);
Router.route("/orders/:id")
  .get(
    verifyToken,
    isUserOfIdOrAdmin,
    OrderValidation.IdValidation,
    validator,
    controller.getSingleOrders
  )
  .delete(
    verifyToken,
    isUserOfIdOrAdmin,
    OrderValidation.deleteValidation,
    validator,
    controller.deleteSingleOrders
  );

module.exports = Router;
