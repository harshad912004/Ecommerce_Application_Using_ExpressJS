const Accountant = require('../models/accountant');
const Product = require('../models/product');
const logger = require("../middlewares/loggerMiddleware");

exports.dashboard = async (req, res) => {
     try {
          const totalRevenue = await Accountant.totalRevenue();
          const totalOrders = await Accountant.totalOrders();
          const monthlyAverage = await Accountant.monthlyAverageRevenue();

          res.render('accountant/dashboard', {
               user: req.user,
               message: 'Welcome to Accountant Dashboard',
               totalRevenue: totalRevenue || 0,
               totalOrders: totalOrders || 0,
               monthlyAverage: monthlyAverage || 0
          });
     } catch (err) {
          logger.error('Error loading accountant dashboard: ' + err.message);
          return res.status(500).render('error', {
               message: 'Accountant Dashboard page not found',
          });
     }
};

// View all orders functionality
exports.viewOrders = async (req, res) => {
     try {
          const orders = await Accountant.getAllOrders();
          res.render('accountant/viewOrders', {
               user: req.user,
               orders: orders,
               message: 'All Orders'
          });
     } catch (err) {
          logger.error('Error viewing orders: ' + err.message);
          return res.status(500).render('error', {
               message: 'Failed to retrieve orders',
          });
     }
};

exports.updateOrderStatus = async (req, res) => {
     try {
          const { order_id, order_status } = req.body;
          await Accountant.updateOrderStatus(order_id, order_status);
          res.redirect('/accountant/orders');
     } catch (err) {
          logger.error('Error updating order status: ' + err.message);
          return res.status(500).render('error', {
               message: 'Failed to update order status',
          });
     }
};