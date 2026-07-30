const winston = require('winston');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'info';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Request ID format
const requestIdFormat = winston.format((info) => {
  if (global.requestId) {
    info.requestId = global.requestId;
  }
  return info;
});

// Custom format with request ID
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  requestIdFormat(),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const requestId = info.requestId ? `[${info.requestId}]` : '';
    return `${info.timestamp} ${info.level}: ${requestId} ${info.message}`;
  })
);

// JSON format for production (optional)
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  requestIdFormat(),
  winston.format.json()
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Use different formats based on environment
const isDevelopment = process.env.NODE_ENV === 'development';

const logger = winston.createLogger({
  level: level(),
  levels,
  format: isDevelopment ? customFormat : jsonFormat,
  transports,
});

module.exports = { logger };
