const { body, param } = require("express-validator");

exports.cartId = [param("id").isMongoId().withMessage("Invalid ObjectId")];

exports.postProduct = [
  body("product_id").isMongoId().withMessage("Invalid ObjectId"),
  body("color").isString().withMessage("Color must be a string"),
];

exports.updateProduct = [
  body("itemId").isMongoId().withMessage("Invalid item ID"),
  body("color").isString().withMessage("Color must be a string"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

exports.deleteProduct = [
  body("itemId").isMongoId().withMessage("Invalid item ID"),
  body("color").isString().withMessage("Color must be a string"),
];
