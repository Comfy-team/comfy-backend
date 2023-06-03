const { body, param } = require("express-validator");
const validator = require("validator");

exports.cartId = [param("id").isMongoId().withMessage("Invalid ObjectId")];

exports.postProduct = [
  body("user_id").isMongoId().withMessage("Invalid ObjectId"),
  body("product_id").isMongoId().withMessage("Invalid ObjectId"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("color").isString().withMessage("Color must be a string"),
];

exports.updateProduct = [
  body("product_id").optional().isMongoId().withMessage("Invalid ObjectId"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("color").optional().isString().withMessage("Color must be a string"),
];

exports.deleteProduct = [
  body("product_id").isMongoId().withMessage("Invalid ObjectId"),
];

exports.emptyCart = [body("cart_id").isMongoId().withMessage("Invalid ObjectId")];