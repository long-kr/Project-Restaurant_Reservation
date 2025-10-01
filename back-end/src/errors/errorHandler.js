const { logger } = require("../config/logger");
const { AppError } = require("./AppError");

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		error: err.message,
		stack: err.stack,
	});
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
	// Operational, trusted error: send message to client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			error: err.message,
		});
	} else {
		// Programming or other unknown error: don't leak error details
		logger.error("ERROR:", err);

		res.status(500).json({
			error: "Something went wrong!",
		});
	}
};

/**
 * Handle database cast errors
 */
const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

/**
 * Handle database duplicate field errors
 */
const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new AppError(message, 400);
};

/**
 * Handle database validation errors
 */
const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};

/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, _next) {
	let error = { ...err };
	error.message = err.message;

	// Set default values - preserve existing status if available
	error.statusCode = error.statusCode || error.status || 500;
	error.status =
		error.status ||
		(error.statusCode >= 400 && error.statusCode < 500 ? "fail" : "error");

	// Log error
	logger.error({
		err: error,
		req: {
			method: req.method,
			url: req.url,
			headers: req.headers,
			body: req.body,
		},
	});

	// Handle specific error types
	if (error.name === "CastError") {
		error = handleCastErrorDB(error);
	}
	if (error.code === 11000) {
		error = handleDuplicateFieldsDB(error);
	}
	if (error.name === "ValidationError") {
		error = handleValidationErrorDB(error);
	}

	// Send error response
	if (process.env.NODE_ENV === "development") {
		sendErrorDev(error, res);
	} else {
		sendErrorProd(error, res);
	}
}

module.exports = errorHandler;
