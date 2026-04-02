require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

// ----- Server Port -----
HOSTNAME = process.env.DB_HOST;
PORT = process.env.PORT || 3000;

// ----- View Engine -----
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// ----- Middleware Setup -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ----- Favicon Handler -----
app.use((req, res, next) => {
     if (req.originalUrl === '/favicon.ico') {
          res.status(204).end();
     } else {
          next();
     }
});

const logger = require("./middlewares/loggerMiddleware");
app.use((req, res, next) => {
     // logger.info(`[${req.method}] ${req.originalUrl}`);
     next();
});
const requestTimer = require("./middlewares/requestTimerMiddleware");
app.use(requestTimer);

// ----- User Context Middleware -----
app.use((req, res, next) => {
     res.locals.user = req.user || null;
     res.locals.role = (req.user?.role || '').toLowerCase();
     res.locals.isUser = res.locals.role === 'user';
     res.locals.isAdmin = res.locals.role === 'admin';
     res.locals.isAccountant = res.locals.role === 'accountant';
     res.locals.isReceptionist = res.locals.role === 'receptionist';
     next();
});

// ----- Routes -----
const { isAuthenticated } = require('./middlewares/auth');
const { requireRole } = require('./middlewares/requireRole');
const Product = require('./controllers/product');

app.get('/', Product.showProductDetails);
app.use('/auth', require('./routes/auth'));
app.use('/admin', isAuthenticated, requireRole('admin'), require('./routes/admin'));
app.use('/user', isAuthenticated, requireRole('user'), require('./routes/user'));
app.use('/accountant', isAuthenticated, requireRole('accountant'), require('./routes/accountant'));
app.use('/receptionist', isAuthenticated, requireRole('receptionist'), require('./routes/receptionist'));

// ----- 404 Error Handler -----
app.use((req, res) => {
     res.status(404).render('error', {
          message: 'Page not found',
          error: { status: 404 }
     });
});

const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

app.listen(PORT, HOSTNAME, () => {
     // console.log(`server running at http://${HOSTNAME}:${PORT}`);
});