/**
 * Custom Application Error Class
 * Extends the built-in Error class to provide more context
 */
class AppError extends Error {
	constructor(message, statusCode = 500, isOperational = true) {
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = isOperational;

		// Capture stack trace
		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Factory functions for common error types
 */
class ErrorFactory {
	static badRequest(message = "Bad Request") {
		return new AppError(message, 400);
	}

	static unauthorized(message = "Unauthorized") {
		return new AppError(message, 401);
	}

	static forbidden(message = "Forbidden") {
		return new AppError(message, 403);
	}

	static notFound(message = "Resource not found") {
		return new AppError(message, 404);
	}

	static conflict(message = "Conflict") {
		return new AppError(message, 409);
	}

	static validation(message = "Validation Error") {
		return new AppError(message, 422);
	}

	static internal(message = "Internal Server Error") {
		return new AppError(message, 500);
	}
}

module.exports = {
	AppError,
	ErrorFactory,
};
