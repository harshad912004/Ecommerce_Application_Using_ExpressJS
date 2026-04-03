const db = require('../config/db_connection');

exports.getTotalActiveUsers = async () => {
     try {
          const getTotalActiveUsersQuery = `
               SELECT COUNT(*) AS totalActiveUsers
               FROM users
               WHERE role_id = 2 AND status = 1
          `;
          const [rows] = await db.execute(getTotalActiveUsersQuery);
          return rows[0].totalActiveUsers;
     } catch (err) {
          console.error("Error fetching total active users:", err);
          throw err;
     }
};

exports.getTotalInactiveUsers = async () => {
     try {
          const getTotalInactiveUsersQuery = `
               SELECT COUNT(*) AS totalInactiveUsers
               FROM users
               WHERE role_id = 2 AND status = 0
          `;
          const [rows] = await db.execute(getTotalInactiveUsersQuery);
          return rows[0].totalInactiveUsers;
     } catch (err) {
          console.error("Error fetching total active users:", err);
          throw err;
     }
};

exports.getFilteredPaginatedUsers = async (page = 1, limit = 5, filters = {}) => {
     try {
          const offset = (page - 1) * limit;
          let query = `
               SELECT u.id, u.name, u.email, u.phone 
               FROM users u 
               JOIN roles r ON u.role_id = r.id
               WHERE r.id = 2 AND u.status = 1
          `;
          const params = [];

          if (filters.name) {
               query += ` AND u.name LIKE ?`;
               params.push(`%${filters.name}%`);
          }
          if (filters.email) {
               query += ` AND u.email LIKE ?`;
               params.push(`%${filters.email}%`);
          }
          if (filters.phone) {
               query += ` AND u.phone LIKE ?`;
               params.push(`%${filters.phone}%`);
          }

          query += ` LIMIT ? OFFSET ?`;
          params.push(limit, offset);

          const [rows] = await db.query(query, params);
          return rows;
     } catch (err) {
          console.error('Error fetching filtered paginated users: ' + err.message);
          throw err;
     }
};

exports.getFilteredUsersCount = async (filters = {}) => {
     try {
          let query = `
               SELECT COUNT(*) AS count 
               FROM users u
               JOIN roles r ON u.role_id = r.id
               WHERE r.id = 2 AND u.status = 1
          `;
          const params = [];

          if (filters.name) {
               query += ` AND u.name LIKE ?`;
               params.push(`%${filters.name}%`);
          }
          if (filters.email) {
               query += ` AND u.email LIKE ?`;
               params.push(`%${filters.email}%`);
          }
          if (filters.phone) {
               query += ` AND u.phone LIKE ?`;
               params.push(`%${filters.phone}%`);
          }

          const [rows] = await db.query(query, params);
          return rows[0].count;
     } catch (err) {
          console.error('Error fetching filtered users count: ' + err.message);
          throw err;
     }
};

exports.deleteUserById = async (userId) => {
     try {
          const deleteUserQuery = `UPDATE users SET status = 0 WHERE id = ?`;
          const [result] = await db.execute(deleteUserQuery, [userId]);
          return result;
     } catch (err) {
          console.error('Error deleting user: ' + err.message);
          throw err;
     }
};

exports.createProduct = async (name, price, brand, description) => {
     try {
          const createProductQuery = `
               INSERT INTO products (name, price, brand, description)
               values (?,?,?,?)
          `;
          await db.query(createProductQuery, [name, price, brand, description]);
     } catch (err) {
          console.error('Error creating product: ' + err.message);
          throw err;
     }
};

exports.updateProduct = async (id, name, price, brand, description) => {
     try {
          const updateProductQuery = `
               UPDATE products 
               SET name = ?, price = ?, brand = ?, description = ?
               WHERE id = ? AND status = 1
          `;
          await db.query(updateProductQuery, [name, price, brand, description, id]);
     } catch (err) {
          console.error('Error updating product: ' + err.message);
          throw err;
     }
};

exports.deleteProduct = async (id) => {
     try {
          const deleteProductQuery = `
               UPDATE products
               SET status = 0
               WHERE id = ? AND status = 1
          `;
          await db.query(deleteProductQuery, [id]);
     } catch (err) {
          console.error('Error deleting product: ' + err.message);
          throw err;
     }
};