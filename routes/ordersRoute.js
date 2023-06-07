const express = require("express");

const validator = require("../middlewares/validations/validator");
const OrderValidation = require("../middlewares/validations/ordersValidation");
const controller = require("../controllers/ordersController");

const Router = express.Router();


Router.route("/orders")
  .get(controller.getAllOrders)
  // .post(validator, controller.postOrders)
  .post(OrderValidation.POSTValidation,validator, controller.postOrders)
  // .patch(validator,controller.updateSingleOrders)
  .patch(OrderValidation.UpdateValidation,validator,controller.updateSingleOrders)
  // .delete(validator,controller.deleteSingleOrders);
  .delete(OrderValidation.deleteValidation,validator,controller.deleteSingleOrders);

Router.route("/orders/:id").get(OrderValidation.IdValidation,validator,controller.getSingleOrders);

module.exports = Router;
