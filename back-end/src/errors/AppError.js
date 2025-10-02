/**
 * Standardized error codes for consistent frontend handling
 */
const ERROR_CODES = {
	// 4xx Client Errors
	BAD_REQUEST: "BAD_REQUEST",
	UNAUTHORIZED: "UNAUTHORIZED",
	FORBIDDEN: "FORBIDDEN",
	NOT_FOUND: "NOT_FOUND",
	METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
	CONFLICT: "CONFLICT",
	VALIDATION_ERROR: "VALIDATION_ERROR",
	UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",

	// 5xx Server Errors
	INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
	BAD_GATEWAY: "BAD_GATEWAY",
	SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
};

/**
 * Custom Application Error Class
 * Extends the built-in Error class to provide more context
 */
class AppError extends Error {
	constructor(
		message,
		statusCode = 500,
		errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
		isOperational = true
	) {
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.errorCode = errorCode;
		this.isOperational = isOperational;

		// Capture stack trace
		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Factory functions for common error types
 */
class ErrorFactory {
	static badRequest(
		message = "Bad Request",
		errorCode = ERROR_CODES.BAD_REQUEST
	) {
		return new AppError(message, 400, errorCode);
	}

	static unauthorized(
		message = "Unauthorized",
		errorCode = ERROR_CODES.UNAUTHORIZED
	) {
		return new AppError(message, 401, errorCode);
	}

	static forbidden(message = "Forbidden", errorCode = ERROR_CODES.FORBIDDEN) {
		return new AppError(message, 403, errorCode);
	}

	static notFound(
		message = "Resource not found",
		errorCode = ERROR_CODES.NOT_FOUND
	) {
		return new AppError(message, 404, errorCode);
	}

	static methodNotAllowed(
		message = "Method not allowed",
		errorCode = ERROR_CODES.METHOD_NOT_ALLOWED
	) {
		return new AppError(message, 405, errorCode);
	}

	static conflict(message = "Conflict", errorCode = ERROR_CODES.CONFLICT) {
		return new AppError(message, 409, errorCode);
	}

	static validation(
		message = "Validation Error",
		errorCode = ERROR_CODES.VALIDATION_ERROR
	) {
		return new AppError(message, 422, errorCode);
	}

	static internal(
		message = "Internal Server Error",
		errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR
	) {
		return new AppError(message, 500, errorCode);
	}
}

module.exports = {
	AppError,
	ErrorFactory,
	ERROR_CODES,
};
