const { body, param, check, query } = require("express-validator");

const validateUploadedImages = (value, { req }) => {
  if (req.files && Object.keys(req.files).length === 0) {
    throw new Error("No image file uploaded");
  }
  return true;
};

const colorHexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

module.exports.postValidation = [
  body("name").isString().withMessage("Product name must be string"),
  body("description").isString().withMessage("Description must be string"),
  body("price").isNumeric().withMessage("Price must be number"),
  check("images").custom(validateUploadedImages),
  body("colors")
    .isArray({ min: 1 })
    .withMessage("colors must be array of hex colors")
    .custom((arr) => {
      if (!arr.every((ele) => colorHexRegex.test(ele))) {
        throw new Error("color must be hex");
      }
      return true;
    }),
  body("discount").isNumeric().withMessage("Discount must be number"),
  body("stock").isInt().withMessage("Stock must be integer"),
  body("category").isMongoId().withMessage("Category id must be mongoId"),
  body("brand").isMongoId().withMessage("Brand id must be mongoId"),
];

module.exports.updateValidation = [
  body("_id").isMongoId().withMessage("Id must be mongoId"),
  body("name").optional().isString().withMessage("Product name must be string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be string"),
  body("price").optional().isNumeric().withMessage("Price must be number"),
  check("images").optional().custom(validateUploadedImages),
  body("colors")
    .optional()
    .isArray({ min: 1 })
    .withMessage("colors must be array of hex colors")
    .custom((arr) => {
      if (!arr.every((ele) => colorHexRegex.test(ele)))
        throw new Error("color must be hex");
      return true;
    }),
  body("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be number"),
  body("stock").optional().isInt().withMessage("Stock must be integer"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category id must be mongoId"),
  body("brand").optional().isMongoId().withMessage("Brand id must be mongoId"),
];

module.exports.deleteValidation = [
  body("_id").isMongoId().withMessage("Id must be mongoId"),
];

module.exports.idValidation = [
  param("id").isMongoId().withMessage("Id must be mongoId"),
];

module.exports.searchValidation = [
  query("search").isString().withMessage("search must be string"),
];
