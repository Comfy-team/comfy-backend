const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = mongoose.model("users");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

module.exports.login = (req, res, next) => {
  let token;
  // Check if admin
  if (req.body.username === "admin" && req.body.password === "123_Admin_321") {
    token = jwt.sign(
      {
        username: "admin",
        role: "admin",
      },
      process.env.secretKey,
      { expiresIn: "3h" }
    );
    res.status(200).json({ data: "ok", token });
  } else {
    // Check if user
    User.findOne({
      email: req.body.email,
      password: bcrypt.hashSync(request.body.password, salt),
    })
      .then((userObj) => {
        if (userObj === null) {
          throw new Error("not authenticated");
        }
        token = jwt.sign(
          {
            email: req.body.email,
            id: userObj._id,
            role: "user",
          },
          process.env.secretKey,
          { expiresIn: "3h" }
        );
        res.status(200).json({ data: "ok", token });
      })
      .catch((error) => next(error));
  }
};
