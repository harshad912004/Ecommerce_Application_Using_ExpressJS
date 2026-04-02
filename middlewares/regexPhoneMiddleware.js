const logger = require('./loggerMiddleware');

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

module.exports = regexPhone;