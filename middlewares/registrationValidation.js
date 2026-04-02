const { body } = require('express-validator');

const registrationValidation = [
     body('name')
          .trim()
          .isString()
          .notEmpty()
          .withMessage('Name is required'),

     body('email')
          .isEmail()
          .withMessage('Invalid email format'),

     body('phone')
          .matches(/^[0-9]{10}$/)
          .withMessage('Phone number must be 10 digits'),

     body('password')
          .isLength({ min: 8, max: 25 })
          .withMessage('Password must be at least 8 characters')
          .matches(/[A-Z]/)
          .withMessage('Password must contain an uppercase letter')
          .matches(/[a-z]/)
          .withMessage('Password must contain a lowercase letter')
          .matches(/[0-9]/)
          .withMessage('Password must contain a number')
          .matches(/[!@#$%^&*() {|:"<>?}]/)
          .withMessage('Password must contain a special character')
];

module.exports = registrationValidation;