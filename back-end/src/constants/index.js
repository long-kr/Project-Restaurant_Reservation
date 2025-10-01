/**
 * Application Constants
 */

// Reservation Status
const RESERVATION_STATUS = {
	BOOKED: "booked",
	SEATED: "seated",
	FINISHED: "finished",
	CANCELLED: "cancelled",
};

// HTTP Status Codes
const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500,
};

// Validation Messages
const VALIDATION_MESSAGES = {
	REQUIRED: (field) => `${field} is required`,
	INVALID_FORMAT: (field) => `${field} has invalid format`,
	MIN_LENGTH: (field, min) =>
		`${field} must be at least ${min} characters long`,
	POSITIVE_NUMBER: (field) => `${field} must be a positive number`,
	FUTURE_DATE: "Date must be in the future",
	CLOSED_DAY: "Restaurant is closed on Tuesdays",
	OUTSIDE_HOURS: "Reservation must be during business hours",
};

// Business Rules
const BUSINESS_RULES = {
	RESTAURANT_HOURS: {
		OPENING: "10:30",
		CLOSING: "21:30",
		LAST_SEATING: "20:30",
	},
	CLOSED_DAYS: [2], // Tuesday
	MIN_PARTY_SIZE: 1,
	MAX_PARTY_SIZE: 20,
};

// Date/Time Formats
const DATE_FORMATS = {
	DATE: "YYYY-MM-DD",
	TIME: "HH:mm",
	DATETIME: "YYYY-MM-DD HH:mm:ss",
	ISO: "YYYY-MM-DDTHH:mm:ss.SSSZ",
};

// Regular Expressions
const REGEX = {
	DATE: /^\d{4}-\d{2}-\d{2}$/,
	TIME: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
	MOBILE_PHONE: /^\d{3}-\d{3}-\d{4}$/,
	MOBILE_PHONE_DIGITS: /^\d{10}$/,
};

module.exports = {
	RESERVATION_STATUS,
	HTTP_STATUS,
	VALIDATION_MESSAGES,
	BUSINESS_RULES,
	DATE_FORMATS,
	REGEX,
};
