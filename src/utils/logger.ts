import { createLogger, format, transports, config } from "winston";
import * as W from "winston-daily-rotate-file";

const { combine, simple, colorize, timestamp, json } = format;
const { Console, DailyRotateFile } = transports;

const fileFormat = combine(
	timestamp({
		format: "YYYY-MM-DD hh:mm:ss.SSS A",
	}),
	json(),
);

const loggerFileOpts = {
	datePattern: "YYYY-MM-DD-HH",
	maxSize: "2m",
	maxFiles: "28d",
	format: fileFormat,
};

const combinedConsoleLogger = new Console({
	format: combine(simple(), colorize({ all: true })),
});

const combinedLogger = new DailyRotateFile({
	filename: "%DATE%_combined.log",
	dirname: "./logs/combined",
	...loggerFileOpts,
});

const errorLogger = new DailyRotateFile({
	filename: "%DATE%_error.log",
	level: "error",
	dirname: "./logs/error",
	...loggerFileOpts,
});

const exceptionLogger = new DailyRotateFile({
	filename: "%DATE%_error.log",
	dirname: "./logs/exception",
	...loggerFileOpts,
});

const rejectionLogger = new DailyRotateFile({
	filename: "%DATE%_error.log",
	dirname: "./logs/rejection",
	...loggerFileOpts,
});

const logger = createLogger({
	levels: config.syslog.levels,
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

const getChildLogger = (requestId: string) => logger.child({ requestId });

export { logger, getChildLogger };
