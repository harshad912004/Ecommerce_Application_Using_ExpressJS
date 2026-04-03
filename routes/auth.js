const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const { isAuthenticated } = require('../middlewares/auth');

const regexValidation = require('../middlewares/validationMiddleware');

const registrationValidation = require('../middlewares/registrationValidation');

router.get('/register', auth.registerForm);

router.post('/register',
     registrationValidation,
     regexValidation.regexName,
     regexValidation.regexEmail,
     regexValidation.regexPhone,
     regexValidation.regexPassword,
     auth.signup
);

router.get('/login', auth.loginForm);

router.post('/login',
     regexValidation.regexEmail,
     auth.signin
);

router.get('/logout',
     isAuthenticated,
     auth.logout
);

module.exports = router;