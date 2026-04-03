const db = require('../config/db_connection');

exports.getAllOrders = async () => {
     try {
          const getAllOrdersQuery = `
               SELECT oi.id, oi.quantity, oi.total_amount, oi.order_status, p.name, u.name 
               FROM order_items oi 
               join products p on oi.product_id = p.id 
               join orders o on oi.order_id = o.id 
               join users u on o.user_id = u.id
          `;
          const [rows] = await db.query(getAllOrdersQuery);
          return rows;
     } catch (err) {
          console.error("Error fetching orders:", err);
          throw err;
     }
};