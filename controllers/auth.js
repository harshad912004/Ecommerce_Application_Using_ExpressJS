const path = require('path');
require('dotenv').config({ path: path.resolve(__filename, '../.env') });

const jwt = require("jsonwebtoken");
const auth = require('../models/auth');
const bcryptjs = require('bcryptjs');
const logger = require("../middlewares/loggerMiddleware");

// users authentication controllers
exports.registerForm = (req, res) => {
     try {
          return res.render("auth/register");
     } catch (err) {
          logger.error('Error showing registration form');
          return res.status(500).render('error', {
               message: 'Registration page not found'
          });
     }
};

exports.signup = async (req, res) => {
     try {
          const {
               name,
               email,
               phone,
               password
          } = req.body;

          const existingUser = await auth.getUserByEmail(email);
          if (existingUser) {
               return res.status(400).render('error', {
                    message: 'User Already Exists'
               });
          }

          // Auto-assign 'user' role (role_id = 2)
          const role = await auth.getRoleByType('user');
          if (!role) {
               logger.error('user role not found');
               return res.status(500).render('error', {
                    message: 'User role not found'
               });
          }

          await auth.registerUser({
               role_id: role.id,
               name,
               email,
               phone,
               password: await bcryptjs.hash(password, 10)
          });

          logger.info(`New user registered: ${email}`);
          return res.redirect('/auth/login');
     } catch (err) {
          logger.error('Error submitting registration form: ' + err.message);
          return res.status(500).render('error', {
               message: 'Error submitting registration form'
          });
     }
};

exports.loginForm = (req, res) => {
     try {
          return res.render("auth/login");
     } catch (err) {
          logger.error('Error showing login form: ' + err.message);
          return res.status(500).render('error', {
               message: 'Login page not found'
          });
     }
};

exports.signin = async (req, res) => {
     try {
          const { email, password } = req.body;

          console.log(email, password);
          const user = await auth.getUserByEmail(email);
          if (!user) {
               logger.error('User not found');
               return res.status(500).render('error', {
                    message: 'User not found'
               });
          }

          const isMatch = await bcryptjs.compare(password, user.password);
          if (!isMatch) {
               logger.error('Invalid Password');
               return res.status(500).render('error', {
                    message: 'Invalid Credentials'
               });
          }

          const token = jwt.sign(
               {
                    id: user.id,
                    email: user.email,
                    role: user.roles
               },
               process.env.JWT_SECRET_KEY,
               { expiresIn: '1h' }
          );

          res.cookie('token', token, {
               httpOnly: true,
               secure: false,
               sameSite: 'lax'
          });

          const role = (user.roles || '').toLowerCase();
          if (role === 'admin') {
               return res.redirect('/admin/');
          } else if (role === 'accountant') {
               return res.redirect('/accountant/');
          } else if (role === 'receptionist') {
               return res.redirect('/receptionist/');
          } else {
               return res.redirect('/user/');
          }
     } catch (err) {
          logger.error('Error submitting login form: ' + err.message);
          return res.status(500).render('error', {
               message: 'Error submitting login form'
          });
     }
};

exports.logout = (req, res) => {
     try {
          res.clearCookie('token');
          return res.redirect('/auth/login');
     } catch (err) {
          logger.error('Error while logging out: ' + err.message);
          return res.status(500).render('error', {
               message: err.message
          });
     }
};