const { body } = require("express-validator");
exports.POSTValidation = function () {
  return [
    body("id").isMongoId().withMessage("enter object id in id "),
    body("cartId").isMongoId().withMessage("enter   object id in cartId "),
    body("address").isObject().withMessage("enter number in address "),
    body("phone").isNumeric().withMessage("enter number in phone "),
    body("date").isNumeric().withMessage("enter number in date "),

  ];
};

