db = require('../config/db_connection');

const Admin = require('../models/admin');
const Product = require('../models/product');
const Orders = require('../models/orders');
const User = require('../models/user');
const logger = require("../middlewares/loggerMiddleware");
const bcryptjs = require('bcryptjs');

exports.dashboard = async (req, res) => {
     try {
          const totalUsers = await Admin.getTotalUsers();
          const totalActiveUsers = await Admin.getTotalActiveUsers();
          const totalInactiveUsers = await Admin.getTotalInactiveUsers();
          const totalAccountant = await Admin.getTotalAccountants();
          const totalReceptionist = await Admin.getTotalReceptionists();
          const totalProducts = await Admin.getTotalProducts();
          const totalOrders = await Admin.getTotalOrders();
          res.render('admin/dashboard', {
               user: req.user,
               totalUsers: totalUsers,
               totalActiveUsers: totalActiveUsers,
               totalInactiveUsers: totalInactiveUsers,
               totalAccountants: totalAccountant,
               totalReceptionists: totalReceptionist,
               totalProducts: totalProducts,
               totalOrders: totalOrders
          });
     } catch (err) {
          logger.error('Dashboard page not found.' + err.message);
          return res.status(500).render('error', {
               message: 'dashboard page not found. ',
          });
     }
};

exports.viewAllProducts = async (req, res) => {
     try {
          const page = parseInt(req.query.page) || 1;
          const limit = 5;

          const filters = {
               name: req.query.name || '',
               brand: req.query.brand || '',
               minPrice: req.query.minPrice || '',
               maxPrice: req.query.maxPrice || '',
          };

          const products = await Admin.getFilteredPaginatedProducts(page, limit, filters);
          const totalProducts = await Admin.getFilteredProductsCount(filters);
          const totalPages = Math.ceil(totalProducts / limit);

          res.render('admin/viewProducts', {
               user: req.user,
               product: products,
               currentPage: page,
               totalPages: totalPages,
               totalItems: totalProducts,
               filters: filters
          });
     } catch (err) {
          logger.error('All products display failed.' + err.message);
          return res.status(500).render('error', {
               message: 'products page not found',
          });
     }
};

exports.viewAllUsers = async (req, res) => {
     try {
          const page = parseInt(req.query.page) || 1;
          const limit = 5;

          const filters = {
               name: req.query.name || '',
               email: req.query.email || '',
               phone: req.query.phone || ''
          };

          const users = await Admin.getFilteredPaginatedUsers(page, limit, filters);
          const totalUsers = await Admin.getFilteredUsersCount(filters);
          const totalPages = Math.ceil(totalUsers / limit);

          res.render('admin/viewUsers', {
               user: req.user,
               users: users,
               currentPage: page,
               totalPages: totalPages,
               totalItems: totalUsers,
               filters: filters
          });
     } catch (err) {
          logger.error('All users display failed.' + err.message);
          return res.status(500).render('error', {
               message: 'users page not found',
          });
     }
};

exports.addUserForm = async (req, res) => {
     try {
          const getRolesQuery = `SELECT id, roles FROM roles where id in(3,4) and status = 1`;
          const [roles] = await db.query(getRolesQuery);
          res.render('admin/addUser', {
               user: req.user,
               roles: roles
          });
     } catch (err) {
          logger.error('Add new users form submission failed.' + err.message);
          return res.status(500).render('error', {
               message: 'Add new users form submission failed.',
          });
     }
};

exports.addUser = async (req, res) => {
     try {
          const { role_id, name, email, phone, password } = req.body;
          const HashPassword = await bcryptjs.hash(password, 10);
          await User.createUser(role_id, name, email, phone, HashPassword);
          res.redirect('/admin/');
     } catch (err) {
          logger.error('Add new users form submission failed.' + err.message);
          return res.status(500).render('error', {
               message: 'Add new users form submission failed.',
          });
     }
};

exports.deleteUser = async (req, res) => {
     try {
          const userId = req.params.id;
          await Admin.deleteUser(userId);
          res.redirect('/admin/users');
     } catch (err) {
          logger.error('Delete user failed.' + err.message);
          return res.status(500).render('error', {
               message: 'Delete user failed.',
          });
     }
};