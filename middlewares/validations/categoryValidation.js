const {query,param,body,check}=require("express-validator");

const validateUploadedImages = ((value, { req }) => {
    if (!req.file) {
      throw new Error('Image file is required.');
    }
    if (!/^image\//.test(req.file.mimetype)) {
      throw new Error('File must be an image.');
    }
    return true;
  });
  
exports.postValidation=[
    body("name").isString().withMessage('name must be string'),
    check("image").custom(validateUploadedImages)   

]

exports.updateValidation=[
    body("id").isMongoId().withMessage('Invalid ObjectId'),
    body("name").optional().isString().withMessage('name must be string'),
    check("image").optional().custom(validateUploadedImages)    
]

exports.deleteValidation=[
    body("id").isMongoId().withMessage('Invalid ObjectId'), 
]

exports.idValidation=[
    param("id").isMongoId().withMessage('Invalid ObjectId'), 
]

module.exports.searchValidation=[
  query("search").isString().withMessage("search must be string"),
]