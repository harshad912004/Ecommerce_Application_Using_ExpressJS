const express = require('express');
const router = express.Router();
const Accountant = require('../controllers/accountant');

router.get('/', Accountant.dashboard);

router.get('/orders', Accountant.viewOrders);
router.post('/updateOrderStatus', Accountant.updateOrderStatus);

module.exports = router;