const { body, param, check } = require("express-validator");
const { ObjectId } = require("mongodb");

const validateUploadedImages = (value, { req }) => {
  if (req.file && !req.file.mimetype.startsWith("image/")) {
    throw new Error("Invalid image file type");
  }

  return true;
};

module.exports.postValidation = [
  body("name").isString().withMessage("Brand name must be string"),
  body("category").isString().withMessage("Brand category must be string"),
  check("image")
    .notEmpty()
    .withMessage("images are required")
    .custom(validateUploadedImages),
  body("products")
    .isArray()
    .withMessage("Products must be array")
    .custom((value) => {
      if (!value.every((id) => ObjectId.isValid(+id))) {
        throw new Error("Invalid ObjectId of product");
      }
      return true;
    }),
];

module.exports.updateValidation = [
  body("_id").isMongoId().withMessage("Id must be MongoId"),
  body("name").optional().isString().withMessage("Brand name must be string"),
  body("category")
    .optional()
    .isString()
    .withMessage("Brand category must be string"),
  check("image").optional().custom(validateUploadedImages),
  body("products")
    .optional()
    .isArray()
    .withMessage("Products must be array")
    .custom((value) => {
      if (!value.every((id) => ObjectId.isValid(+id))) {
        throw new Error("Invalid ObjectId of product");
      }
      return true;
    }),
];

module.exports.deleteValidation = [
  body("_id").isMongoId().withMessage("Id must be mongoId"),
];

module.exports.idValidation = [
  param("id").isMongoId().withMessage("Id must be mongoId"),
];

module.exports.CategoryValidation = [
  param("name").isString().withMessage("Category name must be string"),
];
