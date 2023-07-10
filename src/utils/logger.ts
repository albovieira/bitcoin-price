import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp: time }) => {
  return `${time} [${level}]: ${message}`;
});

const logger = createLogger({
  format: combine(format.colorize(), timestamp(), myFormat),
  transports: [new transports.Console({ level: 'info' })],
});

export default logger;
