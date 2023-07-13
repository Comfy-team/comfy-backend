const express = require("express");
const multer = require("multer");

const validations = require("../middlewares/validations/brandValidation");
const validator = require("../middlewares/validations/validator");
const controller = require("../controllers/brandController");
const { isAdmin, verifyToken } = require("../middlewares/authMw");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (file && !file.mimetype.startsWith("image")) {
      callback(new Error("invalid image type"));
      return;
    }
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
  .post(
    verifyToken,
    isAdmin,
    upload.single("image"),
    validations.postValidation,
    validator,
    controller.addBrand
  )
  .patch(
    verifyToken,
    isAdmin,
    upload.single("image"),
    validations.updateValidation,
    validator,
    controller.updateBrand
  );
router
  .route("/brands/search")
  .get(validations.searchValidation, validator, controller.searchForBrand);

router
  .route("/brands/:id")
  .delete(
    verifyToken,
    isAdmin,
    validations.deleteValidation,
    validator,
    controller.deleteBrand
  );

router
  .route("/brands/:id")
  .get(validations.idValidation, validator, controller.getBrandById);

router
  .route("/brands/:id/products")
  .get(validations.idValidation, validator, controller.getBrandProducts);

router
  .route("/brands/categories/:name/products")
  .get(
    validations.CategoryValidation,
    validator,
    controller.getBrandCategoryProducts
  );

module.exports = router;
