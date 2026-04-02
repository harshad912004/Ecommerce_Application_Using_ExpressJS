const Product = require('../models/product');

exports.getAllProducts = async (req, res) => {
     try {
          const products = await Product.getAllProducts();
          // console.log(`Fetched ${products.length} products`);
          res.render('product/product', { products });
     } catch (err) {
          return res.status(500).render('error', {
               message: 'Failed to retrieve products',
          });
     }
};

exports.showProductDetails = async (req, res) => {
     try {
          const products = await Product.getAllProducts();
          res.render('user/index', {
               user: req.user || null,
               product: products
          });
     } catch (err) {
          return res.status(500).render('error', {
               message: 'Failed to show product details',
          });
     }
};

exports.getProductDetails = async (req, res) => {
     try {
          const productId = req.params.id;
          const product = await Product.getProductDetails(productId);
          if (product.length === 0) {
               return res.status(404).render('error', {
                    message: 'Product not found',
               });
          }
          res.render('productDetails', { product: product[0] });
     } catch (err) {
          return res.status(500).render('error', {
               message: 'Failed to retrieve product details',
          });
     }
};