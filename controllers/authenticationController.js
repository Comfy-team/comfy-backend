const jwt = require("jsonwebtoken");

module.exports.login = (req, res, next) => {
  let token;
  // Check if admin
  if (req.body.username === "admin" && req.body.password === "123") {
    token = jwt.sign(
      {
        username: "admin",
        role: "admin",
      },
      process.env.secretKey,
      { expiresIn: "3h" }
    );
    res.status(200).json({ data: "ok", token });
  }
};
