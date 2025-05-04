import winston from 'winston';

// Define log format
const logFormat = winston.format.printf(
    ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        logFormat
    ),
    defaultMeta: { service: 'realpay-tag-api' },
    transports: [
        // Console logger
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        // Error log file
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Combined log file
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});

export default logger;