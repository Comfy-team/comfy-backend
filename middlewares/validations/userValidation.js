const {query,param,body}=require("express-validator");
const validator = require('validator');

exports.postValidation=[
    body("fullName").isString().withMessage('fullname must be string'),
    body("password").isStrongPassword().withMessage(`Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.`),
    body("email").isEmail().withMessage('email must be Invalid Format'),
    body('phone').isMobilePhone('ar-EG').withMessage('Please enter a valid Egyptian phone number.'),
    body('cart_id').isMongoId().withMessage('cart_id  must be objectId'),
    body("order").isArray().withMessage('order must be array of order id')
    .custom((value)=>{ if (!value.every((id) => validator.isMongoId(id.toString())))
        throw new Error("Array must contain valid MongoDB ObjectIds only.");
        return true;}),
    body("address").isObject().withMessage('address must be object'),
    body('address.city').isString().withMessage('city must be string'),
    body('address.street').isString().withMessage('street must be string'),
    body('address.building').isInt({min:1}).withMessage('building Must be number'),
    body('address.governorate').isString().withMessage('governorate Must be number'),
    body('address.apartment').isString().withMessage('apartment Must be string'),
    body('address.postalCode').isInt({min:1}).withMessage('postalCode Must be number'),
]
exports.updateValidation=[
    body("id").isMongoId().withMessage('Invalid ObjectId'),
    body("fullName").optional().isString().withMessage('fullname must be string'),
    body("password").optional().isStrongPassword().withMessage(`Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.`),
    body("email").optional().isEmail().withMessage('email must be Invalid Format'),
    body('phone').optional().isMobilePhone('ar-EG').withMessage('Please enter a valid Egyptian phone number.'),
    body('cart_id ').optional().isMongoId().withMessage('cart_id  must be objectId'),
    body("order").optional().isArray().withMessage('order  must be array of order id')
    .custom((value)=>{ if (!value.every((id) => validator.isMongoId(id.toString())))
        throw new Error("Array must contain valid MongoDB ObjectIds only.");
        return true;}),
    body("address").optional().isObject().withMessage('address must be object'),
    body('address.city').optional().isString().withMessage('city must be string'),
    body('address.street').optional().isString().withMessage('street must be string'),
    body('address.building').optional().isInt({min:1}).withMessage('building Must be number'),
    body('address.governorate').optional().isString().withMessage('governorate Must be number'),
    body('address.apartment').optional().isString().withMessage('apartment Must be number'),
    body('address.postalCode').optional().isInt({min:1}).withMessage('postalCode Must be number'),
]
exports.deleteValidation=[
    body("id").isMongoId().withMessage('Invalid ObjectId'),
]

exports.idValidation=[
    param("id").isMongoId().withMessage('Invalid ObjectId'),
]

exports.getUserOrder=[

]

exports.getUserCart=[]


