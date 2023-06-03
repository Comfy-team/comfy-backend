const express = require("express");
const controller = require("../controllers/ordersController");

const Router = express.Router();

Router.route("/orders")
.get(controller.getAllOrders)
.post(controller.postOrders)
.patch(controller.updateSingleOrders)
.delete(controller.deleteSingleOrders);

Router.route("/orders/:id")
  .get(controller.getSingleOrders)


module.exports = Router;
