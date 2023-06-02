const express = require("express");
const multer = require("multer");

const validations = require("../middlewares/validations/productValidation");
const validator = require("../middlewares/validations/validator");
const controller = require("../controllers/productController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
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
  .post(upload.array("images"), validations.postValidation, validator, controller.addProduct)
  .patch(validations.updateValidation, validator, controller.updateProduct)
  .delete(validations.deleteValidation, validator, controller.deleteProduct);

router
  .route("/products/:id")
  .get(validations.idValidation, validator, controller.getProductById);

module.exports = router;
