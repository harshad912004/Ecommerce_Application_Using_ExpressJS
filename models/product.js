const db = require('../config/db_connection');

exports.getProductById = async (id) => {
     try {
          const getProductByIdQuery = db.query(`
               CREATE PROCEDURE IF NOT EXISTS GetAllActiveProducts()
               BEGIN
                    SELECT id, name, price, brand, description FROM products WHERE status = 1;
               END
          `, (err) => {
               if (err) {
                    console.error("Error creating GetAllActiveProducts procedure:", err);
               } else {
                    console.log("GetAllActiveProducts procedure created or already exists.");
               }
          });
          const [rows] = await db.query(getProductByIdQuery, [id]);
          return rows[0];
     } catch (err) {
          console.error("Error fetching product by ID:", err);
          throw err;
     }
};

exports.getAllProducts = async () => {
     try {
          const getAllProductQuery = `
               SELECT id, name, price, brand, description FROM products WHERE status = 1;
          `;
          const [rows] = await db.query(getAllProductQuery);
          return rows;
     } catch (err) {
          console.error("Error fetching products:", err);
          throw err;
     }
};

exports.getPaginatedProducts = async (page = 1, limit = 5) => {
     try {
          const offset = (page - 1) * limit;
          const getPaginatedProductQuery = `
               SELECT id, name, price, brand, description 
               FROM products
               WHERE status = 1
               LIMIT ? OFFSET ?
          `;
          const [rows] = await db.query(getPaginatedProductQuery, [limit, offset]);
          return rows;
     } catch (err) {
          console.error("Error fetching paginated products:", err);
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
               WHERE status = 1
          `;
          const [rows] = await db.query(getTotalProductsCountQuery);
          return rows[0].count;
     } catch (err) {
          console.error("Error fetching total products count:", err);
          throw err;
     }
};

exports.getFilteredProducts = async (page = 1, limit = 5, filters = {}) => {
     try {
          const offset = (page - 1) * limit;
          let query = `
               SELECT id, name, price, brand, description 
               FROM products
               WHERE status = 1
          `;
          const params = [];

          if (filters.name && filters.name.trim()) {
               query += ` AND name LIKE ?`;
               params.push(`%${filters.name}%`);
          }

          if (filters.brand && filters.brand.trim()) {
               query += ` AND brand LIKE ?`;
               params.push(`%${filters.brand}%`);
          }

          if (filters.minPrice && !isNaN(filters.minPrice)) {
               query += ` AND price >= ?`;
               params.push(parseFloat(filters.minPrice));
          }

          if (filters.maxPrice && !isNaN(filters.maxPrice)) {
               query += ` AND price <= ?`;
               params.push(parseFloat(filters.maxPrice));
          }

          query += ` LIMIT ? OFFSET ?`;
          params.push(limit, offset);

          const [rows] = await db.query(query, params);
          return rows;
     } catch (err) {
          console.error("Error fetching filtered products:", err);
          throw err;
     }
};

exports.getFilteredProductsCount = async (filters = {}) => {
     try {
          let query = `
               SELECT COUNT(*) AS count 
               FROM products
               WHERE status = 1
          `;
          const params = [];

          if (filters.name && filters.name.trim()) {
               query += ` AND name LIKE ?`;
               params.push(`%${filters.name}%`);
          }

          if (filters.brand && filters.brand.trim()) {
               query += ` AND brand LIKE ?`;
               params.push(`%${filters.brand}%`);
          }

          if (filters.minPrice && !isNaN(filters.minPrice)) {
               query += ` AND price >= ?`;
               params.push(parseFloat(filters.minPrice));
          }

          if (filters.maxPrice && !isNaN(filters.maxPrice)) {
               query += ` AND price <= ?`;
               params.push(parseFloat(filters.maxPrice));
          }

          const [rows] = await db.query(query, params);
          return rows[0].count;
     } catch (err) {
          console.error("Error fetching filtered products count:", err);
          throw err;
     }
};