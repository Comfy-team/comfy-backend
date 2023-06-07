const { body } = require("express-validator");

module.exports = [
  body("email").isEmail().withMessage("email isn't valid"),
  body("password").isStrongPassword().withMessage("password isn't correct"),
];
