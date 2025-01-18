import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const formatter = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      requestId,
      ...meta,
    });
  }),
);

export const winstonConfig = {
  console: new winston.transports.Console({
    level: process.env.LOG_LEVEL ?? 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }),

  // File transport for errors
  errorFile: new winston.transports.DailyRotateFile({
    level: 'error',
    filename: path.join('logs', 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: formatter,
  }),

  // File transport for all logs
  combinedFile: new winston.transports.DailyRotateFile({
    filename: path.join('logs', 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: formatter,
  }),
};

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'debug',
  format: formatter,
  defaultMeta: { service: 'api-node' },
  transports: [
    winstonConfig.console,
    winstonConfig.errorFile,
    winstonConfig.combinedFile,
  ],
});
