const express = require("express");
const multer = require("multer");

const validations = require("../middlewares/validations/productValidation");
const validator = require("../middlewares/validations/validator");
const controller = require("../controllers/productController");
const { isAdmin } = require("../middlewares/authMw");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (file && !file.mimetype.startsWith("image")) {
      callback(new Error("invalid image type"));
      return;
    }
    callback(null, "./uploads/products/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage });

router
  .route("/products")
  .get(controller.getAllProducts)
  .post(
    isAdmin,
    upload.array("images"),
    validations.postValidation,
    validator,
    controller.addProduct
  )
  .patch(
    isAdmin,
    upload.array("images"),
    validations.updateValidation,
    validator,
    controller.updateProduct
  )
  .delete(
    isAdmin,
    validations.deleteValidation,
    validator,
    controller.deleteProduct
  );

router
  .route("/products/:id")
  .get(validations.idValidation, validator, controller.getProductById);

module.exports = router;
