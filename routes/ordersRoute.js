const express = require("express");

const validator = require("../middlewares/validations/validator");
const OrderValidation = require("../middlewares/validations/ordersValidation");
const controller = require("../controllers/ordersController");

const Router = express.Router();


Router.route("/orders")
  .get(isAdmin, controller.getAllOrders)
  .post(isUserOrAdmin,OrderValidation.POSTValidation,validator, controller.postOrders)
  // .patch(isUserOfIdOrAdmin,OrderValidation.UpdateValidation,validator,controller.updateSingleOrders)
  .delete(isUserOfIdOrAdmin,OrderValidation.deleteValidation,validator,controller.deleteSingleOrders);

Router.route("/orders/:id").get(isUserOfIdOrAdmin,OrderValidation.IdValidation,validator,controller.getSingleOrders);

module.exports = Router;
