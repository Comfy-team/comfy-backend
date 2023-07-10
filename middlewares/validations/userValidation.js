const {query,param,body}=require("express-validator");

exports.updateValidation=[
    body("id").isMongoId().withMessage('Invalid ObjectId'),
    body("fullName").optional().isString().withMessage('fullname must be string'),
    body("password").optional().isStrongPassword().withMessage(`Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.`),
    body("email").optional().isEmail().withMessage('email must be Invalid Format'),
    body('phone').optional().isMobilePhone('ar-EG').withMessage('Please enter a valid Egyptian phone number.'),
    body("address").optional().isObject().withMessage('address must be object'),
    body('address.city').optional().isString().withMessage('city must be string'),
    body('address.street').optional().isString().withMessage('street must be string'),
    body('address.building').optional().isInt().withMessage('building Must be number'),
    body('address.governorate').optional().isString().withMessage('governorate Must be number'),
    body('address.apartment').optional().isString().withMessage('apartment Must be number'),
    body('address.postalCode').optional().isInt().withMessage('postalCode Must be number'),
]
exports.deleteValidation=[
    param("id").isMongoId().withMessage('Invalid ObjectId'),
]

exports.idValidation=[
    param("id").isMongoId().withMessage('Invalid ObjectId'),
]
exports.searchValidation=[
    query("search").isString().withMessage("search must be string"),
]




