const path = require('path');
require('dotenv').config({ path: path.resolve(__filename, '../.env') });

const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const Product = require('../models/product');
const logger = require("../middlewares/loggerMiddleware");

exports.welcome = async (req, res) => {
     try {
          const products = await Product.getAllProducts();
          res.render('user/welcome', { user: req.user, product: products });
     } catch (err) {
          logger.error('Welcome page not found.' + err.message);
          return res.status(500).render('error', {
               message: 'Welcome page not found',
          });
     }
};

exports.showCart = async (req, res) => {
     try {
          const cartItems = await User.getCartItems(req.user.id);
          res.render('user/cart', {
               cartItems,
               user: req.user,
               product: cartItems
          });
     } catch (err) {
          logger.error('Cart page not found.' + err.message);
          return res.status(500).render('error', {
               message: 'Cart page not found',
          });
     }
};

exports.addToCart = async (req, res) => {
     try {
          const { product_id, quantity } = req.body;
          const qty = quantity ? parseInt(quantity, 10) : 1;
          if (!product_id || !qty || qty <= 0) {
               return res.status(400).render('error', {
                    message: 'Product ID and valid quantity are required.',
               });
          }
          const result = await User.addToCart(req.user.id, product_id, qty);
          if (result.affectedRows >= 1) {
               return res.redirect('/user/cart');
          } else {
               return res.status(500).render('error', {
                    message: 'Failed to add item to cart.',
               });
          }
     } catch (err) {
          logger.error('Add to cart failed.' + err.message);
          return res.status(500).render('error', {
               message: 'Add to Cart failed',
          });
     }
};

exports.removeFromCart = async (req, res) => {
     try {
          const { product_id } = req.body;
          if (!product_id) {
               return res.status(400).render('error', {
                    message: 'Product ID is required.',
               });
          }
          const result = await User.removeFromCart(req.user.id, product_id);
          if (result.affectedRows === 1) {
               res.redirect('/user/cart');
          } else {
               return res.status(500).render('error', {
                    message: 'Failed to remove item from cart.',
               });
          }
     } catch (err) {
          logger.error('Remove from cart failed.' + err.message);
          return res.status(500).render('error', {
               message: 'Remove From Cart failed',
          });
     }
};

exports.placeOrder = async (req, res) => {
     try {
          const result = await User.placeOrder(req.user.id);
          if (result.affectedRows >= 1) {
               return res.redirect('/user/orders');
          } else {
               return res.status(500).render('error', {
                    message: 'Failed to place order.',
               });
          }
     } catch (err) {
          logger.error('Order placed failed:', err);
          return res.status(500).render('error', {
               message: 'Order placed failed',
          });
     }
};

exports.viewOrders = async (req, res) => {
     try {
          const orders = await User.getUserOrders(req.user.id);
          res.render('user/orders', { user: req.user, orders });
     } catch (err) {
          logger.error('Orders page not found.' + err.message);
          return res.status(500).render('error', {
               message: 'Orders page not found',
          });
     }
};

exports.viewProfile = async (req, res) => {
     try {
          const userProfile = await User.getUserProfile(req.user.id);
          res.render('user/updateProfile', { user: req.user, profile: userProfile });
     } catch (err) {
          logger.error('Profile page not found.' + err.message);
          return res.status(500).render('error', {
               message: 'Profile page not found',
          });
     }
};

exports.updateProfile = async (req, res) => {
     try {
          const { name, phone, password } = req.body;

          const newPassword = await bcryptjs.hash(password, 10);
          const result = await User.updateUserProfile(req.user.id, name, phone, newPassword);
          if (result.affectedRows >= 1) {
               return res.redirect('/user/profile');
          } else {
               return res.status(500).render('error', {
                    message: 'Failed to update profile.',
               });
          }
     } catch (err) {
          logger.error('Profile update failed.' + err.message);
          return res.status(500).render('error', {
               message: 'Profile update failed',
          });
     }
};