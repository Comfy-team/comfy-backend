const express = require("express");


const validations = require("../middlewares/validations/userValidation");
const validator = require("../middlewares/validations/validator");
const controller = require("../controllers/userController");
const authMW =require("./../middlewares/authMw");

const router = express.Router();

router
  .route("/users")
  .get(authMW.verifyToken,authMW.isAdmin,controller.getAllUsers)
  .patch(authMW.verifyToken,authMW.isUserOrAdmin,validations.updateValidation,validator,controller.updateUser)
  .delete(authMW.verifyToken,authMW.isUserOfIdOrAdmin,validations.deleteValidation,validator,controller.deleteUser)

router
  .route("/users/orders").get(authMW.verifyToken,authMW.isAdmin,validator,controller.getAllUsersOrders) 

router
  .route("/users/:id")
  .get(authMW.verifyToken,authMW.isUserOfIdOrAdmin,validations.idValidation, validator, controller.getUserById);

router
  .route("/users/:id/cart").get(authMW.verifyToken,authMW.isUserOfIdOrAdmin,validations.idValidation,validator,controller.getUserCart)  

router
    .route("/users/:id/orders").get(authMW.verifyToken,authMW.isUserOfIdOrAdmin,validations.idValidation,validator,controller.getUserOrders) 


module.exports = router;

