const db = require('../config/db_connection');

exports.getAllRoles = async () => {
     try {
          const getAllRolesQuery = `
               SELECT id, roles 
               FROM roles 
               where status = 1
          `;
          const [rows] = await db.query(getAllRolesQuery);
          return rows;
     } catch (err) {
          console.error("Error fetching roles:", err);
          throw err;
     }
};

exports.getUserByEmail = async (email) => {
     try {
          const getUserEmailQuery = `
               SELECT id, name, email, phone, password 
               FROM users
               WHERE email = ? and status = 1
          `;
          const [rows] = await db.query(getUserEmailQuery, [email]);
          return rows;
     } catch (err) {
          console.error("Error fetching user by email:", err);
          throw err;
     }
};

exports.createUser = async (role_id, name, email, phone, password) => {
     try {
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

exports.getCartItems = async (user_id) => {
     try {
          const getCartItemsQuery = `
               select 
                    p.id as product_id,
                    p.name,
                    p.brand,
                    p.price,
                    ci.quantity,
                    (p.price * ci.quantity) as total_price
               from cart_items ci 
               join products p on ci.product_id = p.id 
               join carts c on ci.cart_id = c.id 
               where c.user_id = ?
          `;
          const [rows] = await db.query(getCartItemsQuery, [user_id]);
          return rows;
     } catch (err) {
          console.error("Error fetching cart items:", err);
          throw err;
     }
};

exports.addToCart = async (user_id, product_id, quantity = 1) => {
     try {
          const [carts] = await db.query(`
               SELECT id 
               FROM carts 
               WHERE user_id = ? and status = 1
          `, [user_id]);

          let cart_id;
          if (carts.length > 0) {
               cart_id = carts[0].id;
          } else {
               const [createdCart] = await db.query(`
                    INSERT INTO carts (user_id) 
                    VALUES (?)
               `, [user_id]);
               cart_id = createdCart.insertId;
          }

          const [existingItems] = await db.query(
               `SELECT 
                    id, quantity 
               FROM 
                    cart_items 
               WHERE 
                    cart_id = ? AND product_id = ?
          `, [cart_id, product_id]
          );

          if (existingItems.length > 0) {
               const item = existingItems[0];
               const [result] = await db.query(`
                    UPDATE 
                         cart_items 
                    SET 
                         quantity = quantity + ? 
                    WHERE 
                         id = ?
               `, [parseInt(quantity, 10), item.id]
               );
               return result;
          } else {
               const [result] = await db.query(
                    'INSERT INTO cart_items (cart_id, product_id, quantity, total_amount) VALUES (?, ?, ?, ?)',
                    [cart_id, product_id, parseInt(quantity, 10), parseInt(quantity, 10) * (await db.query('SELECT price FROM products WHERE id = ?', [product_id]))[0][0].price]
               );
               return result;
          }
     } catch (err) {
          console.error("Error adding to cart:", err);
          throw err;
     }
};

exports.removeFromCart = async (user_id, product_id) => {
     try {
          const [carts] = await db.query('SELECT id FROM carts WHERE user_id = ?', [user_id]);
          if (carts.length === 0) {
               return { affectedRows: 0 };
          }
          const cart_id = carts[0].id;
          const [result] = await db.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cart_id, product_id]);
          return result;
     } catch (err) {
          console.error("Error removing from cart:", err);
          throw err;
     }
};

exports.placeOrder = async (user_id) => {
     try {
          const [carts] = await db.query('SELECT id FROM carts WHERE user_id = ?', [user_id]);
          if (carts.length === 0) {
               return { affectedRows: 0 };
          }
          const cart_id = carts[0].id;
          const [cartItems] = await db.query('SELECT product_id, quantity FROM cart_items WHERE cart_id = ?', [cart_id]);
          if (cartItems.length === 0) {
               return { affectedRows: 0 };
          }
          const connection = await db.getConnection();
          try {
               await connection.beginTransaction();
               const [existingOrders] = await connection.query('SELECT id FROM orders WHERE user_id = ? LIMIT 1', [user_id]);
               let order_id;
               if (existingOrders.length > 0) {
                    order_id = existingOrders[0].id;
               } else {
                    const [orderResult] = await connection.query('INSERT INTO orders (user_id) VALUES (?)', [user_id]);
                    order_id = orderResult.insertId;
               }
               for (const item of cartItems) {
                    await connection.query(`
                         INSERT INTO order_items (order_id, product_id, quantity, total_amount, order_date, order_status) 
                         VALUES (?, ?, ?, ?, NOW(), 'pending')
                    `, [order_id, item.product_id, item.quantity, item.quantity * (await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]))[0][0].price]
                    );
               }
               await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cart_id]);
               await connection.commit();
               return { affectedRows: 1 };
          } catch (err) {
               await connection.rollback();
               console.error("Error during order placement transaction:", err);
               throw err;
          }
     } catch (err) {
          console.error("Error placing order:", err);
          throw err;
     }
};

exports.getUserOrders = async (user_id) => {
     try {
          const getUserOrdersQuery = `
               SELECT
                    o.user_id,
                    oi.product_id,
                    p.name,
                    p.brand,
                    oi.quantity,
                    (p.price * oi.quantity) as total_price,
                    oi.order_status,
                    oi.order_date
               FROM orders o
               JOIN order_items oi ON oi.order_id = o.id
               JOIN products p ON oi.product_id = p.id
               WHERE o.user_id = ?
               ORDER BY oi.order_date DESC
          `;
          const [rows] = await db.query(getUserOrdersQuery, [user_id]);
          return rows;
     } catch (err) {
          console.error("Error fetching user orders:", err);
          throw err;
     }
};

exports.getUserProfile = async (user_id) => {
     try {
          const getUserProfileQuery = `
               SELECT name, email, phone 
               FROM users 
               WHERE id = ? and status = 1
          `;
          const [rows] = await db.query(getUserProfileQuery, [user_id]);
          return rows;
     } catch (err) {
          console.error("Error fetching user profile:", err);
          throw err;
     }
};

exports.updateUserProfile = async (user_id, name, phone, password) => {
     try {
          const updateUserProfileQuery = `
               UPDATE users 
               SET name = ?, phone = ?, password = ? 
               WHERE id = ? and status = 1
          `;
          const [result] = await db.query(updateUserProfileQuery, [name, phone, password, user_id]);
          return result;
     } catch (err) {
          console.error("Error updating user profile:", err);
          throw err;
     }
};