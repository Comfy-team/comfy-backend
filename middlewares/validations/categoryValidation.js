const {query,param,body,check}=require("express-validator");
const validator = require('validator');

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
    body("products_id").isArray().withMessage('products_id must be array of order id')
    .custom((value)=>{ if (!value.every((id) => validator.isMongoId(id.toString())))
        throw new Error("Array must contain valid MongoDB ObjectIds only.");
        return true;}),
    check("image").custom(validateUploadedImages)   

]

exports.updateValidation=[
    body("id").isMongoId().withMessage('Invalid ObjectId'),
    body("name").optional().isString().withMessage('name must be string'),
    body("products_id").optional().isArray().withMessage('products_id must be array of order id')
    .custom((value)=>{ if (!value.every((id) => validator.isMongoId(id.toString())))
        throw new Error("Array must contain valid MongoDB ObjectIds only.");
        return true;}),
    check("image").optional().custom(validateUploadedImages)    
]

exports.deleteValidation=[
    body("id").isMongoId().withMessage('Invalid ObjectId'), 
]

exports.idValidation=[
    param("id").isMongoId().withMessage('Invalid ObjectId'), 
]

exports.getCategotyProducts=[
    body("name").isString().withMessage('name must be string')
]
