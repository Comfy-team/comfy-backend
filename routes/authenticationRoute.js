const express = require("express");

const { login } = require("../controllers/authenticationController");
const validation = require("../middlewares/validations/loginValidation");
const validator = require("../middlewares/validations/validator");

const router = express.Router();

router.route("/login").post(validation, validator, login);

module.exports = router;
