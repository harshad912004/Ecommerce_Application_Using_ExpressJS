const express = require('express');
const router = express.Router();
const Receptionist = require('../controllers/receptionist');

router.get('/', Receptionist.dashboard);

router.get('/users', Receptionist.viewAllUsers);
router.get('/users/delete/:id', Receptionist.deleteUser);

router.get('/products', Receptionist.viewAllProducts);

router.get('/products/addProduct', Receptionist.addProductForm);
router.post('/products/addProduct', Receptionist.addProduct);

router.get('/products/edit:id', Receptionist.editProductForm);
router.post('/products/edit:id', Receptionist.editProduct);

router.post('/products/delete:id', Receptionist.deleteProduct);

module.exports = router;