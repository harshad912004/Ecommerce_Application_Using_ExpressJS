const Receptionist = require('../models/receptionist');
const Product = require('../models/product');
const logger = require("../middlewares/loggerMiddleware");

exports.dashboard = async (req, res) => {
     try {
          const totalActiveUsers = await Receptionist.getTotalActiveUsers();
          const totalInactiveUsers = await Receptionist.getTotalInactiveUsers();

          res.render('receptionist/dashboard', {
               user: req.user,
               message: 'Welcome to Receptionist Dashboard',
               totalActiveUsers: totalActiveUsers || 0,
               totalInactiveUsers: totalInactiveUsers || 0
          });
     } catch (err) {
          logger.error('Error loading receptionist dashboard: ' + err.message);
          return res.status(500).render('error', {
               message: 'Receptionist Dashboard page not found',
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

          const users = await Receptionist.getFilteredPaginatedUsers(page, limit, filters);
          const totalUsers = await Receptionist.getFilteredUsersCount(filters);
          const totalPages = Math.ceil(totalUsers / limit);

          res.render('receptionist/users', {
               user: req.user,
               users: users,
               currentPage: page,
               totalPages: totalPages,
               totalItems: totalUsers,
               filters: filters
          });
     } catch (err) {
          logger.error('Error loading users page: ' + err.message);
          return res.status(500).render('error', {
               message: 'Users page not found',
          });
     }
};

exports.deleteUser = async (req, res) => {
     try {
          const userId = req.params.id;
          await Receptionist.deleteUserById(userId);
          logger.info('User deleted successfully: ' + userId);
          res.redirect('/receptionist/users');
     } catch (err) {
          logger.error('Error deleting user: ' + err.message);
          return res.status(500).render('error', {
               message: 'Failed to delete user',
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
               maxPrice: req.query.maxPrice || ''
          };

          const products = await Product.getFilteredProducts(page, limit, filters);
          const totalProducts = await Product.getFilteredProductsCount(filters);
          const totalPages = Math.ceil(totalProducts / limit);

          res.render('receptionist/products', {
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

exports.addProductForm = async (req, res) => {
     try {
          res.render('receptionist/addProduct', {
               user: req.user
          });
     } catch (err) {
          logger.error('Add new products form submission failed.' + err.message);
          return res.status(500).render('error', {
               message: 'Add new products form not displayed.',
          });
     }
};

exports.addProduct = async (req, res) => {
     try {
          const { name, price, brand, description } = req.body;
          await Receptionist.createProduct(name, price, brand, description);
          res.redirect('/receptionist/dashboard');
     } catch (err) {
          logger.error('Add new products form submission failed.' + err.message);
          return res.status(500).render('error', {
               message: 'Add new products form submission failed.',
          });
     }
};

exports.editProductForm = async (req, res) => {
     try {
          const productId = req.params.id;
          const product = await Product.getProductById(productId);
          if (!product) {
               return res.status(404).render('error', {
                    message: 'Product not found',
               });
          }
          res.render('receptionist/editProductForm', {
               user: req.user,
               product: product
          });
     } catch (err) {
          logger.error('Edit product form display failed.' + err.message);
          return res.status(500).render('error', {
               message: 'Edit product form display failed.',
          });
     }
};

exports.editProduct = async (req, res) => {
     try {
          const productId = req.params.id;
          const { name, price, brand, description } = req.body;
          await Receptionist.updateProduct(productId, name, price, brand, description);
          res.redirect('/receptionist/products');
     } catch (err) {
          logger.error('Edit product failed.' + err.message);
          return res.status(500).render('error', {
               message: 'Edit product failed.',
          });
     }
};

exports.deleteProduct = async (req, res) => {
     try {
          const productId = req.params.id;
          await Receptionist.deleteProduct(productId);
          res.redirect('/receptionist/products');
     } catch (err) {
          logger.error('Delete product failed.' + err.message);
          return res.status(500).render('error', {
               message: 'Delete product failed.',
          });
     }
};