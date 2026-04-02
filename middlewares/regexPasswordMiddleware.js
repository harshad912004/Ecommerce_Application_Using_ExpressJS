const logger = require('./loggerMiddleware');

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

module.exports = regexPassword;