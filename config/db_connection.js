// config/db.js

const mysql = require('mysql2');

// const path = require('path');
// require('dotenv').config({ path: path.resolve(__filename, '../.env') });

const pool = mysql.createPool({
     host: process.env.DB_HOST,
     port: process.env.DB_PORT || 3306,
     database: process.env.DB_DATABASE,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0,
});

const promisePool = pool.promise();

(async () => {
     try {
          const connection = await promisePool.getConnection();
          // console.log('DB Connected Successfully');
          connection.release();
     } catch (err) {
          console.error('DB Connection Failed:', err.message);
          process.exit(1);
     }
})();

module.exports = promisePool;