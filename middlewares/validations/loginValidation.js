const { body } = require("express-validator");

module.exports = [
  body("username").notEmpty().withMessage("username is required"),
  body("password").notEmpty().withMessage("password is required"),
];
