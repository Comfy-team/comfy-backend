const express = require('express');
const router = express.Router();
const controller = require('../controllers/cartController');
const validations = require('../middlewares/validations/cartValidation');
const validator = require('../middlewares/validations/validator');
const {isUserOrAdmin,isAdmin,verifyToken } = require("../middlewares/authMw");

router.get('/cart',verifyToken,isAdmin, controller.getAllCarts);

router.route("/cart/:id")
.get(verifyToken,isUserOrAdmin,validations.cartId, validator, controller.getCartById)
.post(verifyToken,isUserOrAdmin,validations.postProduct, validator, controller.postProductToCart);

router.patch('/cart/:id/empty', verifyToken,isUserOrAdmin,validator, controller.emptyCart);

router.patch('/cart/:id/delete', verifyToken,isUserOrAdmin,validations.deleteProduct, validator, controller.deleteProductFromCart);

router.patch('/cart/:cartId/update', verifyToken,isUserOrAdmin,validations.updateProduct, validator, controller.updateProductInCart);
module.exports = router;