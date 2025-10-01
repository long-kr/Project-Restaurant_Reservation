const { validationResult } = require("express-validator");

/**
 * Standardized validation error response structure
 * @typedef {Object} ValidationError
 * @property {string} field - The field name that has the error
 * @property {string} message - Human-readable error message
 * @property {string} code - Error code for programmatic handling
 * @property {*} value - The invalid value that was provided
 */

/**
 * Validation error codes for consistent frontend handling
 */
const VALIDATION_ERROR_CODES = {
	REQUIRED: "REQUIRED",
	INVALID_FORMAT: "INVALID_FORMAT",
	INVALID_TYPE: "INVALID_TYPE",
	TOO_SHORT: "TOO_SHORT",
	TOO_LONG: "TOO_LONG",
	INVALID_RANGE: "INVALID_RANGE",
	BUSINESS_RULE: "BUSINESS_RULE",
	INVALID_DATE: "INVALID_DATE",
	INVALID_TIME: "INVALID_TIME",
	PAST_DATE: "PAST_DATE",
	CLOSED_DAY: "CLOSED_DATE",
	INVALID_PHONE: "INVALID_PHONE",
	INVALID_STATUS: "INVALID_STATUS",
};

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
	const { param, msg, value } = error;

	// Extract field name (remove 'data.' prefix if present)
	let field = param ? param.replace(/^data\./, "") : "unknown";

	// Handle special case where param might be undefined
	if (!param && msg) {
		// Try to extract field name from the message
		if (msg.includes("first_name")) {
			field = "first_name";
		} else if (msg.includes("last_name")) {
			field = "last_name";
		} else if (msg.includes("mobile_number")) {
			field = "mobile_number";
		} else if (msg.includes("reservation_date")) {
			field = "reservation_date";
		} else if (msg.includes("reservation_time")) {
			field = "reservation_time";
		} else if (msg.includes("people")) {
			field = "people";
		} else if (msg.includes("status")) {
			field = "status";
		}
	}

	// Determine error code based on message content
	let code = VALIDATION_ERROR_CODES.INVALID_FORMAT;
	let message = msg || "Invalid value";

	// Map common error patterns to codes
	if (msg && (msg.includes("required") || msg.includes("must be provided"))) {
		code = VALIDATION_ERROR_CODES.REQUIRED;
	} else if (msg && msg.includes("future")) {
		code = VALIDATION_ERROR_CODES.PAST_DATE;
	} else if (msg && msg.includes("closed")) {
		code = VALIDATION_ERROR_CODES.CLOSED_DAY;
	} else if (
		msg &&
		(msg.includes("business hours") || msg.includes("reservation_time"))
	) {
		code = VALIDATION_ERROR_CODES.BUSINESS_RULE;
	} else if (msg && (msg.includes("phone") || msg.includes("mobile_number"))) {
		code = VALIDATION_ERROR_CODES.INVALID_PHONE;
	} else if (msg && msg.includes("people") && msg.includes("number")) {
		code = VALIDATION_ERROR_CODES.INVALID_TYPE;
	} else if (
		msg &&
		msg.includes("people") &&
		(msg.includes("between") || msg.includes("1 and 20"))
	) {
		code = VALIDATION_ERROR_CODES.INVALID_RANGE;
	} else if (msg && msg.includes("status") && msg.includes("unknown")) {
		code = VALIDATION_ERROR_CODES.INVALID_STATUS;
	}

	// Use field-specific message if available
	if (FIELD_ERROR_MESSAGES[field] && FIELD_ERROR_MESSAGES[field][code]) {
		message = FIELD_ERROR_MESSAGES[field][code];
	}

	return {
		field,
		message,
		code,
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

		// Group errors by field for easier frontend handling
		const errorsByField = validationErrors.reduce((acc, error) => {
			if (!acc[error.field]) {
				acc[error.field] = [];
			}
			acc[error.field].push({
				message: error.message,
				code: error.code,
				value: error.value,
			});
			return acc;
		}, {});

		// Create standardized error response
		const errorResponse = {
			error: "Validation failed",
			message: "Please check the following fields and try again",
			statusCode: 400,
			validation: {
				errors: errorsByField,
				summary: validationErrors.map((e) => e.message),
			},
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
	VALIDATION_ERROR_CODES,
	FIELD_ERROR_MESSAGES,
	BUSINESS_RULE_MESSAGES,
};
