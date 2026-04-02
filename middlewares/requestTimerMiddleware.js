const logger = require("./loggerMiddleware");

const requestTimerMiddleware = (req, res, next) => {
     const startTime = Date.now();
     const isoStart = new Date(startTime).toISOString();
     const originalWriteHead = res.writeHead;
     res.writeHead = function (...args) {
          const endTime = Date.now();
          const isoEnd = new Date(endTime).toISOString();
          const duration = endTime - startTime;
          logger.info(`[${req.method} ${req.originalUrl}] = duration ${duration}ms`);
          res.setHeader('X-Request-Start', isoStart);
          res.setHeader('X-Request-End', isoEnd);
          res.setHeader('X-Response-Time', `${duration}ms`);
          return originalWriteHead.apply(res, args);
     };
     next();
};

module.exports = requestTimerMiddleware;