const db = require('../config/db_connection');

exports.getUserByEmail = async (email) => {
     try {
          const getUserEmailQuery = `
               SELECT u.id, u.name, u.email, u.phone, u.password, r.roles
               FROM users u
               JOIN roles r ON u.role_id = r.id
               WHERE u.email = ? AND u.status = 1
               LIMIT 1
          `;
          const [rows] = await db.query(getUserEmailQuery, [email]);
          return rows[0];
     } catch (err) {
          console.error("Error fetching user by email:", err);
          throw err;
     }
};

exports.getRoleByType = async (roles) => {
     try {
          const sql = `
               SELECT id, roles 
               FROM roles 
               WHERE roles = ? AND status = 1 
               LIMIT 1
          `;
          const [rows] = await db.execute(sql, [roles]);
          return rows[0];
     } catch (error) {
          logger.error('Error fetching role: ' + error.message);
          throw error;
     }
};

exports.registerUser = async (userData) => {
     try {
          const { role_id, name, email, phone, password } = userData;
          const createUserQuery = `
               INSERT INTO users (role_id, name, email, phone, password)
               VALUES (?, ?, ?, ?, ?)
          `;
          const [result] = await db.query(createUserQuery, [role_id, name, email, phone, password]);
          return result;
     } catch (err) {
          console.error("Error creating user:", err);
          throw err;
     }
};