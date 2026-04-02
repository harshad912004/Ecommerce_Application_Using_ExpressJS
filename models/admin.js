const db = require('../config/db_connection');

exports.getAllUsers = async () => {
     try {
          const getAllUsersQuery = `
               SELECT id, role_id, name, email, phone FROM users WHERE role_id = 2
          `;
          const [rows] = await db.query(getAllUsersQuery);
          return rows;
     } catch (err) {
          console.error('Error fetching users: ' + err.message);
          throw err;
     }
};

exports.getPaginatedUsers = async (page = 1, limit = 5) => {
     try {
          const offset = (page - 1) * limit;
          const getPaginatedUsersQuery = `
               SELECT 
                    u.id,
                    u.name,
                    u.email,
                    u.phone 
               FROM 
                    users u 
               JOIN 
                    roles r 
               ON 
                    u.role_id = r.id
               WHERE r.id = 2 AND u.status = 1
               LIMIT ? OFFSET ?
          `;
          const [rows] = await db.query(getPaginatedUsersQuery, [limit, offset]);
          return rows;
     } catch (err) {
          console.error('Error fetching paginated users: ' + err.message);
          throw err;
     }
};

exports.getFilteredPaginatedUsers = async (page = 1, limit = 5, filters = {}) => {
     try {
          const offset = (page - 1) * limit;
          let query = `
               SELECT 
                    u.id,
                    u.name,
                    u.email,
                    u.phone,
                    u.status 
               FROM 
                    users u 
               JOIN 
                    roles r 
               ON 
                    u.role_id = r.id
               WHERE r.id = 2
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
               SELECT 
                    COUNT(*) AS count 
               FROM 
                    users u
               JOIN 
                    roles r 
               ON 
                    u.role_id = r.id
               WHERE r.id = 2
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

exports.getTotalUsersCount = async () => {
     try {
          const getTotalUsersCountQuery = `
               SELECT 
                    COUNT(*) AS count 
               FROM 
                    users u
               JOIN 
                    roles r 
               ON 
                    u.role_id = r.id
               WHERE r.id = 2 AND u.status = 1
          `;
          const [rows] = await db.query(getTotalUsersCountQuery);
          return rows[0].count;
     } catch (err) {
          console.error('Error fetching total users count: ' + err.message);
          throw err;
     }
};

exports.getTotalUsers = async () => {
     try {
          const getTotalUsersQuery = `
               SELECT 
                    COUNT(*) AS totalUsers 
               FROM 
                    users 
               WHERE 
                    role_id = 2
          `;
          const [rows] = await db.query(getTotalUsersQuery);
          return rows[0].totalUsers;
     } catch (err) {
          console.error('Error fetching count of users: ' + err.message);
          throw err;
     }
};

exports.getTotalActiveUsers = async () => {
     try {
          const getTotalActiveUsersQuery = `
               SELECT 
                    COUNT(*) AS totalActiveUsers 
               FROM 
                    users 
               WHERE 
                    role_id = 2 AND status = 1
          `;
          const [rows] = await db.query(getTotalActiveUsersQuery);
          return rows[0].totalActiveUsers;
     } catch (err) {
          console.error('Error fetching count of active users: ' + err.message);
          throw err;
     }
};

exports.getTotalInactiveUsers = async () => {
     try {
          const getTotalInactiveUsersQuery = `
               SELECT 
                    COUNT(*) AS totalInactiveUsers 
               FROM 
                    users 
               WHERE 
                    role_id = 2 AND status = 0
          `;
          const [rows] = await db.query(getTotalInactiveUsersQuery);
          return rows[0].totalInactiveUsers;
     } catch (err) {
          console.error('Error fetching count of inactive users: ' + err.message);
          throw err;
     }
};

exports.deleteUser = async (id) => {
     try {
          const deleteUserQuery = `
               UPDATE
                    users
               SET
                    status = 0
               WHERE
                    id = ? AND status = 1
          `;
          await db.query(deleteUserQuery, [id]);
     } catch (err) {
          console.error('Error deleting user: ' + err.message);
          throw err;
     }
};

exports.getTotalAccountants = async () => {
     try {
          const getTotalAccountantQuery = `
               SELECT 
                    COUNT(*) AS totalAccountant 
               FROM 
                    users 
               WHERE 
                    role_id = 3 AND status = 1
          `;
          const [rows] = await db.query(getTotalAccountantQuery);
          return rows[0].totalAccountant;
     } catch (err) {
          console.error('Error fetching count of accountants: ' + err.message);
          throw err;
     }
};

exports.getTotalReceptionists = async () => {
     try {
          const getTotalReceptionistQuery = `
               SELECT 
                    COUNT(*) AS totalReceptionist 
               FROM 
                    users 
               WHERE 
                    role_id = 4 AND status = 1
          `;
          const [rows] = await db.query(getTotalReceptionistQuery);
          return rows[0].totalReceptionist;
     } catch (err) {
          console.error('Error fetching count of receptionists: ' + err.message);
          throw err;
     }
};

exports.getTotalProducts = async () => {
     try {
          const getTotalProductsQuery = `
               SELECT 
                    COUNT(*) AS totalProducts 
               FROM 
                    products 
               WHERE 
                    status = 1
          `;
          const [rows] = await db.query(getTotalProductsQuery);
          return rows[0].totalProducts;
     } catch (err) {
          console.error('Error fetching count of receptionists: ' + err.message);
          throw err;
     }
};

exports.getPaginatedProducts = async (page = 1, limit = 5) => {
     try {
          const offset = (page - 1) * limit;
          const getPaginatedProductsQuery = `
               SELECT 
                    id,
                    name,
                    brand,
                    price,
                    description
               FROM 
                    products 
               WHERE 
                    status = 1
               LIMIT ? OFFSET ?
          `;
          const [rows] = await db.query(getPaginatedProductsQuery, [limit, offset]);
          return rows;
     } catch (err) {
          console.error('Error fetching paginated products: ' + err.message);
          throw err;
     }
};

exports.getFilteredPaginatedProducts = async (page = 1, limit = 5, filters = {}) => {
     try {
          const offset = (page - 1) * limit;
          let query = `
               SELECT 
                    id,
                    name,
                    brand,
                    price,
                    description
               FROM 
                    products 
               WHERE 
                    status = 1
          `;
          const params = [];

          if (filters.name) {
               query += ` AND name LIKE ?`;
               params.push(`%${filters.name}%`);
          }
          if (filters.brand) {
               query += ` AND brand LIKE ?`;
               params.push(`%${filters.brand}%`);
          }
          if (filters.price) {
               query += ` AND price LIKE ?`;
               params.push(`%${filters.price}%`);
          }

          query += ` LIMIT ? OFFSET ?`;
          params.push(limit, offset);

          const [rows] = await db.query(query, params);
          return rows;
     } catch (err) {
          console.error('Error fetching filtered paginated products: ' + err.message);
          throw err;
     }
};

exports.getFilteredProductsCount = async (filters = {}) => {
     try {
          let query = `
               SELECT 
                    COUNT(*) AS count 
               FROM 
                    products 
               WHERE 
                    status = 1
          `;
          const params = [];

          if (filters.name) {
               query += ` AND name LIKE ?`;
               params.push(`%${filters.name}%`);
          }
          if (filters.brand) {
               query += ` AND brand LIKE ?`;
               params.push(`%${filters.brand}%`);
          }
          if (filters.price) {
               query += ` AND price LIKE ?`;
               params.push(`%${filters.price}%`);
          }

          const [rows] = await db.query(query, params);
          return rows[0].count;
     } catch (err) {
          console.error('Error fetching filtered products count: ' + err.message);
          throw err;
     }
};

exports.getTotalProductsCount = async () => {
     try {
          const getTotalProductsCountQuery = `
               SELECT 
                    COUNT(*) AS count 
               FROM 
                    products 
               WHERE 
                    status = 1
          `;
          const [rows] = await db.query(getTotalProductsCountQuery);
          return rows[0].count;
     } catch (err) {
          console.error('Error fetching total Products count: ' + err.message);
          throw err;
     }
};

exports.getTotalOrders = async () => {
     try {
          const getTotalOrdersQuery = `
               SELECT 
                    COUNT(*) AS totalOrders 
               FROM 
                    order_items 
               WHERE 
                    status = 1
          `;
          const [rows] = await db.query(getTotalOrdersQuery);
          return rows[0].totalOrders;
     } catch (err) {
          console.error('Error fetching count of receptionists: ' + err.message);
          throw err;
     }
};