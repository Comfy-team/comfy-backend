const express = require("express");
const multer = require("multer");

const validations = require("../middlewares/validations/categoryValidation");
const validator = require("../middlewares/validations/validator");
const controller = require("../controllers/categoryController");
const authMW =require("./../middlewares/authMw");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./uploads/category/");
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  });
  const filter = (req,file,cb)=>{
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true);
        console.log(true);
      } else {
        //if u want to throw error if file type doesn'match
        // cb(new Error("file type doesn't match"),false);
        cb(null, false);
      }
}

  const upload = multer({ 
    storage:storage,
    limits:{fileSize:1024*1024*5},
    fileFilter: filter,
   });

router
  .route("/categories")
  .get(controller.getAllCategory)
  .post(authMW.verifyToken,authMW.isAdmin,upload.single("image"),validations.postValidation,validator,controller.addCategory)
  .patch(authMW.verifyToken,authMW.isAdmin,upload.single('image'),validations.updateValidation,validator,controller.updateCategory)
  .delete(authMW.verifyToken,authMW.isAdmin,validations.deleteValidation,validator,controller.deleteCategory)

  router
  .route("/categories/search")
  .get(validations.searchValidation,validator,controller.searchForCategory) 
   
  router
  .route("/categories/:id")
  .get(validations.idValidation, validator, controller.getCategoryById);

module.exports = router;