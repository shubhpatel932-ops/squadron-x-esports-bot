import winston from 'winston';
import { config } from '../config/index.js';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

// Ensure logs directory exists
await mkdir(config.logging.filePath, { recursive: true });

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaStr}`;
  })
);

export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'squadron-x-bot' },
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    // File output - all logs
    new winston.transports.File({
      filename: `${config.logging.filePath}/bot.log`,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Error file
    new winston.transports.File({
      filename: `${config.logging.filePath}/error.log`,
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    // Admin actions file
    new winston.transports.File({
      filename: `${config.logging.filePath}/admin-actions.log`,
      maxsize: 5242880,
      maxFiles: 10,
    }),
  ],
});

export default logger;
