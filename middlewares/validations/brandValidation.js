const { body, param, check ,query} = require("express-validator");

const validateUploadedImages = (value, { req }) => {
  if (!req.file || !req.file.mimetype.startsWith("image/")) {
    throw new Error("Invalid image file type");
  }
  return true;
};

module.exports.postValidation = [
  body("name").isString().withMessage("Brand name must be string"),
  body("category").isString().withMessage("Brand category must be string"),
  check("image").custom(validateUploadedImages),
];

module.exports.updateValidation = [
  body("_id").isMongoId().withMessage("Id must be MongoId"),
  body("name").optional().isString().withMessage("Brand name must be string"),
  body("category")
    .optional()
    .isString()
    .withMessage("Brand category must be string"),
  check("image").optional().custom(validateUploadedImages),
];

module.exports.deleteValidation = [
  param("id").isMongoId().withMessage("Id must be mongoId"),
];

module.exports.idValidation = [
  param("id").isMongoId().withMessage("Id must be mongoId"),
];

module.exports.CategoryValidation = [
  param("name").isString().withMessage("Category name must be string"),
];

module.exports.searchValidation=[
  query("search").isString().withMessage("search must be string"),
]