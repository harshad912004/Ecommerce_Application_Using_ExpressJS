const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "../logFiles");
if (!fs.existsSync(logDirectory)) {
     fs.mkdirSync(logDirectory);
}

// Winston Logger
const winston = require('winston');

const logger = winston.createLogger({
     level: 'info',
     format: winston.format.combine(
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.colorize(),
          winston.format.printf(
               info => `[${info.timestamp}] ${info.level} : ${info.message}`
          )
     ),
     transports: [
          new winston.transports.File({
               filename: path.join(logDirectory, "error.log"),
               level: "error"
          }),
          new winston.transports.File({
               filename: path.join(logDirectory, "combined.log"),
               level: "info"
          })
     ],
     exceptionHandlers: [
          new winston.transports.File({
               filename: path.join(logDirectory, "exceptions.log")
          })
     ]
});

module.exports = logger;