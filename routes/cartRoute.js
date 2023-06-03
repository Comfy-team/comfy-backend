const express = require("express");
const router = express.Router();

const  controller= require("../controllers/cartController");
const validator = require("../middlewares/validations/validator");
const validations = require("../middlewares/validations/cartValidation");

router
  .route("/cart")
  .get(controller.getAllCarts)
  .post(validations.postProduct,validator, controller.postProductToCart)
  .patch(validations.updateProduct,validator, controller.updateProductInCart)
  .delete(validations.deleteProduct,validator, controller.deleteProductFromCart);

router.route("/:id").get(validations.cartId,validator, controller.getCartById);

router.route("/empty").patch(validations.emptyCart,validator, controller.emptyCart);

module.exports = router;