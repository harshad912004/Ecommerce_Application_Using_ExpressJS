const express = require('express');
const router = express.Router();
const Admin = require('../controllers/admin');

router.get('/', Admin.dashboard);

router.get('/products', Admin.viewAllProducts);

router.get('/users', Admin.viewAllUsers);
router.get('/addUser', Admin.addUserForm);
router.post('/addUser', Admin.addUser);

module.exports = router;