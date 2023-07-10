const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  try {
    let token = req.get("authorization").split(" ")[1];
    let decodedToken = jwt.verify(token, process.env.secretKey);
    req.decodedObject = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.decodedObject.role === "admin") {
    next();
  } else {
    let error = new Error("not Authorized");
    error.status = 403;
    next(error);
  }
};

module.exports.isUserOrAdmin = (req, res, next) => {
  if (req.decodedObject.role === "user" || req.decodedObject.role === "admin") {
    next();
  } else {
    let error = new Error("not Authorized");
    error.status = 403;
    next(error);
  }
};

module.exports.isUserOfIdOrAdmin = (req, res, next) => {
  let userId = req.query.id || req.params.id;
  if (
    req.decodedObject.role === "admin" ||
    (req.decodedObject.role === "user" && req.decodedObject.id === userId)
  ) {
    next();
  } else {
    let error = new Error("not Authorized");
    error.status = 403;
    next(error);
  }
};
