import winston from "winston"


const { printf } = winston.format;

// for prod we will use log winston

const transports: winston.transport[] = [];


if (process.env.NODE_ENV !== 'production') {
	transports.push(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(
					{
						all: true,
						colors: {
							info: 'blue',
							warn: 'yellow',
							error: 'red',
							debug: 'cyan',
							verbose: 'grey',
							http: 'green',
						}
					}
				),
				winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
				printf(({ level, message, stack, timestamp, ...meta }) => {
					//const logEntry = {};
					//return JSON.stringify(logEntry)

					return `${timestamp} [${level?.toUpperCase()}]: ${message} ${stack ? stack : ''}${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
				})
			)
		})
	)
}

export const logger = winston.createLogger({
	level: process.env.NODE_ENV || 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.json()),
	silent: process.env.NODE_ENV == "test",
	transports: transports
})
