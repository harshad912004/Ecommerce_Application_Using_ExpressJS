const logger = require('./loggerMiddleware');

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

module.exports = regexName;