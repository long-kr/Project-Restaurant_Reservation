const { validationResult } = require("express-validator");
const { ERROR_CODES } = require("../errors/AppError");

/**
 * Standardized validation error response structure
 * @typedef {Object} ValidationError
 * @property {string} field - The field name that has the error
 * @property {string} message - Human-readable error message
 * @property {string} code - Error code for programmatic handling
 * @property {*} value - The invalid value that was provided
 */

/**
 * Field-specific error message mappings
 */
const FIELD_ERROR_MESSAGES = {
	first_name: {
		REQUIRED: "First name is required",
		INVALID_FORMAT:
			"First name must contain only letters, spaces, hyphens and apostrophes",
		TOO_SHORT: "First name must be at least 2 characters long",
	},
	last_name: {
		REQUIRED: "Last name is required",
		INVALID_FORMAT:
			"Last name must contain only letters, spaces, hyphens and apostrophes",
		TOO_SHORT: "Last name must be at least 2 characters long",
	},
	mobile_number: {
		REQUIRED: "Mobile number is required",
		INVALID_PHONE: "Mobile number must be a valid 10-digit phone number",
	},
	people: {
		REQUIRED: "Number of people is required",
		INVALID_TYPE: "Number of people must be a number",
		INVALID_RANGE: "Number of people must be between 1 and 20",
	},
	reservation_date: {
		REQUIRED: "Reservation date is required",
		INVALID_DATE: "Reservation date must be a valid date in YYYY-MM-DD format",
		PAST_DATE: "Reservation date must be in the future",
		CLOSED_DAY: "Restaurant is closed on Tuesdays",
	},
	reservation_time: {
		REQUIRED: "Reservation time is required",
		INVALID_TIME: "Reservation time must be a valid time in HH:MM format",
		BUSINESS_RULE:
			"Reservation time must be during business hours (10:30 AM - 9:30 PM)",
	},
	status: {
		INVALID_STATUS:
			"Status must be one of: booked, seated, finished, cancelled",
	},
	data: {
		REQUIRED: "Request body must contain a data object",
	},
};

/**
 * Business rule error messages
 */
const BUSINESS_RULE_MESSAGES = {
	FUTURE_DATE: "Reservation date must be in the future",
	CLOSED_DAY: "Restaurant is closed on Tuesdays",
	BUSINESS_HOURS:
		"Reservation time must be during business hours (10:30 AM - 9:30 PM)",
	LAST_SEATING: "Reservation time must be before 9:30 PM for last seating",
	INVALID_STATUS_CREATE:
		"Cannot create reservation with status 'seated' or 'finished'",
	INVALID_STATUS_UPDATE: "Cannot update reservation to 'seated' or 'finished'",
};

/**
 * Parse express-validator error and convert to standardized format
 * @param {Object} error - Express-validator error object
 * @returns {ValidationError} Standardized validation error
 */
function parseValidationError(error) {
	const { msg, value, path } = error;

	let field = path === "data" ? "data" : path.split(".")[1] || "unknown";
	let message = msg || "Invalid value";

	return {
		field,
		message,
		code: ERROR_CODES.VALIDATION_ERROR,
		value: value || null,
	};
}

/**
 * Enhanced validation middleware with standardized error format
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function checkValidation(req, res, next) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		// Convert express-validator errors to standardized format
		const validationErrors = errors.array().map(parseValidationError);

		// Create array of field errors for the response
		const fieldErrors = validationErrors.map((error) => {
			return {
				field: error.field,
				message: error.message,
				code: error.code,
				value: error.value,
			};
		});

		// Create standardized error response
		const errorResponse = {
			error: ERROR_CODES.VALIDATION_ERROR,
			message: "Please check the following fields and try again",
			statusCode: 400,
			validation: fieldErrors,
		};

		return res.status(400).json(errorResponse);
	}

	next();
}

/**
 * Create a validation error for a specific field
 * @param {string} field - Field name
 * @param {string} code - Error code
 * @param {*} value - Invalid value
 * @returns {ValidationError}
 */
function createValidationError(field, code, value = null) {
	const message = FIELD_ERROR_MESSAGES[field]?.[code] || "Invalid value";

	return {
		field,
		message,
		code,
		value,
	};
}

module.exports = {
	checkValidation,
	createValidationError,
	FIELD_ERROR_MESSAGES,
	BUSINESS_RULE_MESSAGES,
};
