import * as winston from "winston";
import * as W from "winston-daily-rotate-file";

const { combine, simple, colorize, timestamp, json } = winston.format;
const { Console, DailyRotateFile } = winston.transports;
const { createLogger } = winston;

const fileFormat = combine(
  timestamp({
    format: "YYYY-MM-DD hh:mm:ss.SSS A",
  }),
  json(),
);

const loggerFileOpts = {
  datePattern: "YYYY-MM-DD-HH",
  maxSize: "2m",
  dirname: "./logs/combined",
  maxFiles: "28d",
  format: fileFormat,
};

const combinedConsoleLogger = new Console({
  format: combine(simple(), colorize({ all: true })),
});

const combinedLogger = new DailyRotateFile({
  filename: "%DATE%_combined.log",
  ...loggerFileOpts,
});

const errorLogger = new DailyRotateFile({
  filename: "%DATE%_error.log",
  level: "error",
  ...loggerFileOpts,
});

const exceptionLogger = new DailyRotateFile({
  filename: "%DATE%_error.log",
  ...loggerFileOpts,
});

const rejectionLogger = new DailyRotateFile({
  filename: "%DATE%_error.log",
  ...loggerFileOpts,
});

const logger = createLogger({
  levels: winston.config.syslog.levels,
  level: "info",
  defaultMeta: {
    service: "fee-checkrer",
  },
  transports: [combinedConsoleLogger, combinedLogger, errorLogger],
  exceptionHandlers: [exceptionLogger],
  rejectionHandlers: [rejectionLogger],
  exitOnError: false,
});

// just to make sure that the winston-daily-rotate-file gets imported
W.name;

export { logger };
