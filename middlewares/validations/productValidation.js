const { body, param, check, query } = require("express-validator");

const validateUploadedImages = (value, { req }) => {
  if (req.files && Object.keys(req.files).length === 0 && !req.body.images) {
    throw new Error("No image file uploaded");
  }
  return true;
};

const colorHexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

module.exports.postValidation = [
  body("name")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Product name must be string"),
  body("description")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Description must be string"),
  body("price")
    .isFloat({ min: 1 })
    .withMessage("Price must be number greater than 0"),
  check("images").custom(validateUploadedImages),
  body("colors")
    .isArray({ min: 1 })
    .withMessage("colors must be array of at least one color")
    .custom((arr) => {
      let parsedArr = arr.map((ele) => JSON.parse(ele));
      if (!parsedArr.every((ele) => colorHexRegex.test(ele.color))) {
        throw new Error("color must be hex");
      }
      if (
        !parsedArr.every((ele) => !Number.isNaN(ele.stock) && ele.stock > 0)
      ) {
        throw new Error("stock must be number greater than 0");
      }
      return true;
    }),
  body("discount").isNumeric().withMessage("Discount must be number"),
  body("category").isMongoId().withMessage("Category id must be mongoId"),
  body("brand").isMongoId().withMessage("Brand id must be mongoId"),
];

module.exports.updateValidation = [
  body("_id").isMongoId().withMessage("Id must be mongoId"),
  body("name")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Product name must be string"),
  body("description")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Description must be string"),
  body("price")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Price must be number greater than 0"),
  check("images").optional().custom(validateUploadedImages),
  body("colors")
    .optional()
    .isArray({ min: 1 })
    .withMessage("colors must be array of at least one color")
    .custom((arr) => {
      let parsedArr = arr.map((ele) => JSON.parse(ele));
      if (!parsedArr.every((ele) => colorHexRegex.test(ele.color))) {
        throw new Error("color must be hex");
      }
      if (
        !parsedArr.every((ele) => !Number.isNaN(ele.stock) && ele.stock >= 0)
      ) {
        throw new Error("stock must be number greater than 0");
      }
      return true;
    }),
  body("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be number"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category id must be mongoId"),
  body("brand").optional().isMongoId().withMessage("Brand id must be mongoId"),
];

module.exports.deleteValidation = [
  query("_id").isMongoId().withMessage("Id must be mongoId"),
];

module.exports.idValidation = [
  param("id").isMongoId().withMessage("Id must be mongoId"),
];

module.exports.searchValidation = [
  query("search").isString().withMessage("search must be string"),
];
