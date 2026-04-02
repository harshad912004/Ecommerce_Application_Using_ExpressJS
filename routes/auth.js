const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const { isAuthenticated } = require('../middlewares/auth');

const regexName = require('../middlewares/regexNameMiddleware');
const regexEmail = require('../middlewares/regexEmailMiddleware');
const regexPhone = require('../middlewares/regexPhoneMiddleware');
const regexPassword = require('../middlewares/regexPasswordMiddleware');

const registrationValidation = require('../middlewares/registrationValidation');

router.get('/register', auth.registerForm);

router.post('/register',
     registrationValidation,
     regexName,
     regexEmail,
     regexPhone,
     regexPassword,
     auth.signup
);

router.get('/login', auth.loginForm);

router.post('/login',
     regexEmail,
     auth.signin
);

router.get('/logout',
     isAuthenticated,
     auth.logout
);

module.exports = router;