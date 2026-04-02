const Orders = require('../models/orders');

exports.getAllOrders = async (req, res) => {
     try {
          const orders = await Orders.getAllOrders();
          res.render('order/orders', { orders });
     } catch (err) {
          return res.status(500).render('error', {
               message: 'Failed to retrieve orders',
          });
     }
};