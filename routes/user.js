const express = require('express');
const router = express.Router();
const User = require('../controllers/user');

router.get('/', User.welcome);

router.get('/cart', User.showCart);
router.post('/cart/add', User.addToCart);
router.post('/cart/remove', User.removeFromCart);

router.post('/placeOrder', User.placeOrder);
router.get('/orders', User.viewOrders);

router.get('/profile', User.viewProfile);
router.post('/profile/update', User.updateProfile);

module.exports = router;