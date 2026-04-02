const db = require('../config/db_connection');

// Get all orders with details
exports.getAllOrders = async () => {
     try {
          const getAllOrdersQuery = `
               SELECT 
                    u.id as user_id,
                    u.name as user_name,
                    u.email,
                    u.phone,
                    oi.order_id,
                    oi.order_date,
                    oi.order_status,
                    oi.total_amount,
                    COUNT(oi.id) as items_count,
                    SUM(oi.quantity) as total_quantity
               FROM 
                    order_items oi
               JOIN 
                    orders o ON oi.order_id = o.id
               JOIN 
                    users u ON o.user_id = u.id
               GROUP BY 
                    oi.order_id, oi.order_date, oi.order_status, oi.total_amount, u.id, u.name, u.email, u.phone
               ORDER BY 
                    oi.order_date DESC
          `;
          const [rows] = await db.query(getAllOrdersQuery);
          return rows;
     } catch (err) {
          console.error("Error fetching orders:", err);
          throw err;
     }
};

exports.updateOrderStatus = async (orderId, newStatus) => {
     try {
          const updateStatusQuery = `
               UPDATE order_items SET order_status = ? WHERE order_id = ?
          `;
          await db.query(updateStatusQuery, [newStatus, orderId]);
     } catch (err) {
          console.error("Error updating order status:", err);
          throw err;
     }
};

exports.totalRevenue = async () => {
     try {
          const revenueQuery = `
               SELECT SUM(total_amount) as total_revenue FROM order_items WHERE order_status = 'completed'
          `;
          const [rows] = await db.query(revenueQuery);
          return rows[0].total_revenue;
     } catch (err) {
          console.error("Error fetching total revenue:", err);
          throw err;
     }
};

exports.totalOrders = async () => {
     try {
          const ordersQuery = `
               SELECT COUNT(DISTINCT id) as total_orders FROM order_items
          `;
          const [rows] = await db.query(ordersQuery);
          return rows[0].total_orders;
     } catch (err) {
          console.error("Error fetching total orders:", err);
          throw err;
     }
};

exports.monthlyAverageRevenue = async () => {
     try {
          const monthlyAverageQuery = `
               SELECT
                    AVG(monthly_revenue) as monthly_average
               FROM (
                    SELECT
                         DATE_FORMAT(order_date, '%Y-%m') as month,
                         SUM(total_amount) as monthly_revenue
                    FROM
                         order_items
                    WHERE
                         order_status = 'completed'
                    GROUP BY
                         month
               ) as monthly_revenues
          `;
          const [rows] = await db.query(monthlyAverageQuery);
          return rows[0].monthly_average;
     } catch (err) {
          console.error("Error fetching monthly average revenue:", err);
          throw err;
     }
};