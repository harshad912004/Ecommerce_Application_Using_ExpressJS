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

module.exports = regexEmail;