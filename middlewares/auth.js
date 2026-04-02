require('dotenv').config();

const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
     const authHeader = req.headers['authorization'];
     let token = authHeader && authHeader.split(' ')[1];

     if (!token && req.headers.cookie) {
          const statedCookies = req.headers.cookie.split(';').map(c => c.trim());
          const tokenCookie = statedCookies.find(c => c.startsWith('token='));
          if (tokenCookie) {
               token = tokenCookie.split('=')[1];
          }
     }

     if (!token) {
          return res.status(401).render('error', {
               success: "false",
               message: "Token not found. Please login."
          });
     }

     try {
          const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
          if (!jwtSecret) {
               return res.status(500).render('error', {
                    success: "false",
                    message: "JWT secret is not configured."
               });
          }

          const decoded = jwt.verify(token, jwtSecret);
          req.user = decoded;
          next();
     } catch (err) {
          console.error('isAuthenticated error:', err);
          return res.status(401).render('error', {
               success: "false",
               message: "Invalid token. Please login again."
          });
     }
};