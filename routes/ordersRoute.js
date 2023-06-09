const express = require("express");

const validator = require("../middlewares/validations/validator");
const OrderValidation = require("../middlewares/validations/ordersValidation");
const controller = require("../controllers/ordersController");
const { isAdmin } = require("../middlewares/authMw");
const { isUserOrAdmin } = require("../middlewares/authMw");
const { isUserOfIdOrAdmin } = require("../middlewares/authMw");
const authMW =require("./../middlewares/authMw");

const Router = express.Router();


Router.route("/orders")
  .get(authMW.verifyToken,isAdmin, controller.getAllOrders)
  .post(authMW.verifyToken,isUserOrAdmin,OrderValidation.POSTValidation,validator, controller.postOrders)
  .delete(authMW.verifyToken,isUserOfIdOrAdmin,OrderValidation.deleteValidation,validator,controller.deleteSingleOrders);

Router.route("/orders/:id").get(authMW.verifyToken,isUserOfIdOrAdmin,OrderValidation.IdValidation,validator,controller.getSingleOrders);

module.exports = Router;
