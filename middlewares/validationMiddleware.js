const logger = require('./loggerMiddleware');

const regexEmail = (req, res, next) => {
     const email = (req.body.email || '').trim().toLowerCase();
     const regex_email = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     if (!regex_email.test(email)) {
          logger.error('Please enter a valid email');
          return res.status(400).render(
               'error', {
               message: 'Please enter a valid email'
          });
     }
     next();
};

const regexName = (req, res, next) => {
     const name = (req.body.name || '').trim();
     const regex_name = /^[A-Za-z0-9 ]{3,25}$/;
     if (!regex_name.test(name)) {
          logger.error('Please enter a valid name, 3-25 alphabetic characters.');
          return res.status(400).render(
               'error', {
               message: 'Please enter a valid name (3-25 letters).'
          });
     }
     next();
};

const regexPassword = (req, res, next) => {
     const password = req.body.password || '';
     const regex_password = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*+= {|:"<>?}])[A-Za-z0-9@#$%^&*+= {|:"<>?}]{8,12}$/;
     if (!regex_password.test(password)) {
          logger.error('Password must be 8-12 characters and include upper, lower, number, special char.');
          return res.status(400).render(
               'error', {
               message: 'Password must be 8-12 characters and include uppercase, lowercase, number, and special character.'
          });
     }
     next();
};

const regexPhone = (req, res, next) => {
     const phone = (req.body.phone || '').trim();
     const regex_phone = /^\d{10}$/;
     if (!regex_phone.test(phone)) {
          logger.error('Please enter valid 10 digit phone number.');
          return res.status(400).render(
               'error', {
               message: 'Please enter a valid 10 digit phone number.'
          });
     }
     next();
};

module.exports = {
     regexEmail,
     regexName,
     regexPassword,
     regexPhone
};