const express = require("express");


const validations = require("../middlewares/validations/userValidation");
const validator = require("../middlewares/validations/validator");
const controller = require("../controllers/userController");

const router = express.Router();

router
  .route("/users")
  .get(controller.getAllUsers)
  .post(validations.postValidation,validator,controller.addUser)
  .patch(validations.updateValidation,validator,controller.updateUser)
  .delete(validations.deleteValidation,validator,controller.deleteUser)

router
  .route("/users/orders").get(validator,controller.getAllUsersOrders) 

router
  .route("/users/:id")
  .get(validations.idValidation, validator, controller.getUserById);

router
  .route("/users/:id/cart").get(validations.idValidation,validator,controller.getUserCart)  

router
    .route("/users/:id/orders").get(validations.idValidation,validator,controller.getUserOrders) 


module.exports = router;

