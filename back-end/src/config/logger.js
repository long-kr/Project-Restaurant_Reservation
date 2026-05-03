const pino = require("pino");
const config = require("./index");

// Create logger instance
const logger = pino({
	level: config.logging.level,
	transport: config.logging.prettyPrint
		? {
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "SYS:standard",
					ignore: "pid,hostname",
				},
			}
		: undefined,
	serializers: {
		req: pino.stdSerializers.req,
		res: pino.stdSerializers.res,
		err: pino.stdSerializers.err,
	},
});

// Create HTTP logger middleware
const httpLogger = require("pino-http")({
	logger,
	customLogLevel: (res, err) => {
		if (res.statusCode >= 400 && res.statusCode < 500) {
			return "warn";
		} else if (res.statusCode >= 500 || err) {
			return "error";
		}
		return "info";
	},
	customSuccessMessage: (res) => {
		if (res.req) {
			return `${res.req.method} ${res.req.url} - ${res.statusCode}`;
		}
		return `Response - ${res.statusCode}`;
	},
	customErrorMessage: (err, res) => {
		if (res.req) {
			return `${res.req.method} ${res.req.url} - ${res.statusCode} - ${err.message}`;
		}
		return `Error - ${res.statusCode} - ${err.message}`;
	},
});

module.exports = {
	logger,
	httpLogger,
};
