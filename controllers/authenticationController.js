const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = mongoose.model("users");
// const saltRounds = process.env.saltRounds;
// const salt = bcrypt.genSaltSync(saltRounds);

module.exports.login = (req, res, next) => {
  let token;
  // Check if admin
  if (
    req.body.email === "admin@gmail.com" &&
    req.body.password === "123_Admin_321"
  ) {
    token = jwt.sign(
      {
        email: "admin@gmail.com",
        role: "admin",
      },
      process.env.secretKey,
      { expiresIn: "6h" }
    );
    res.status(200).json({ data: "ok", token });
  } else {
    // Check if user
    User.findOne({ email: req.body.email })
      .then((userObj) => {
        if (userObj === null) {
          throw new Error("not authenticated");
        }
        let result = bcrypt.compareSync(req.body.password, userObj.password);
        if (!result) {
          throw new Error("not authenticated");
        }
        token = jwt.sign(
          {
            email: req.body.email,
            id: userObj._id,
            role: "user",
          },
          process.env.secretKey,
          { expiresIn: "6h" }
        );
        res.status(200).json({ data: "ok", token });
      })
      .catch((error) => next(error));
  }
};
