const express = require("express");
const multer = require("multer");

const validations = require("../middlewares/validations/brandValidation");
const validator = require("../middlewares/validations/validator");
const controller = require("../controllers/brandController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/brands/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage });

router
  .route("/brands")
  .get(controller.getAllBrands)
  .post(upload.single("image"), validations.postValidation, validator, controller.addBrand)
  .patch(upload.single('image'),validations.updateValidation, validator, controller.updateBrand)
  .delete(validations.deleteValidation, validator, controller.deleteBrand);

router
  .route("/brands/:id")
  .get(validations.idValidation, validator, controller.getBrandById);

  router
  .route("/brands/:id/products")
  .get(validations.idValidation, validator, controller.getBrandProducts);

  router
  .route("/brands/categories/:name/products")
  .get(validations.CategoryValidation, validator, controller.getBrandCategoryProducts);

module.exports = router;
