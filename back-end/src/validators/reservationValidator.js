const { body, query } = require("express-validator");
const { RESERVATION_STATUS, REGEX } = require("../constants");
const DateTimeUtils = require("../utils/dateTime");
const PhoneNumberUtils = require("../utils/phoneNumber");
const { checkValidation } = require("./validationErrorHandler");

/**
 * Common validation rules for reservations
 */
const reservationValidationRules = [
	// Data object validation
	body("data")
		.exists()
		.withMessage("Request body must contain a data object")
		.notEmpty()
		.withMessage("Request body must contain a data object")
		.isObject()
		.withMessage("Request body must contain a data object"),

	// Basic field validations
	body("data.first_name")
		.exists()
		.withMessage("First name is required")
		.trim()
		.notEmpty()
		.withMessage("First name is required")
		.isLength({ min: 2 })
		.withMessage("First name must be at least 2 characters long")
		.matches(/^[a-zA-Z\s'-]+$/)
		.withMessage(
			"First name must contain only letters, spaces, hyphens and apostrophes"
		),

	body("data.last_name")
		.exists()
		.withMessage("Last name is required")
		.trim()
		.notEmpty()
		.withMessage("Last name is required")
		.isLength({ min: 2 })
		.withMessage("Last name must be at least 2 characters long")
		.matches(/^[a-zA-Z\s'-]+$/)
		.withMessage(
			"Last name must contain only letters, spaces, hyphens and apostrophes"
		),

	body("data.mobile_number")
		.exists()
		.withMessage("Mobile number is required")
		.trim()
		.notEmpty()
		.withMessage("Mobile number is required")
		.custom((value) => {
			if (!PhoneNumberUtils.isValid(value)) {
				throw new Error("Mobile number must be a valid 10-digit phone number");
			}
			return true;
		})
		.customSanitizer(PhoneNumberUtils.normalize),

	body("data.people")
		.exists()
		.withMessage("Number of people is required")
		.notEmpty()
		.withMessage("Number of people is required")
		.custom((value) => {
			if (typeof value === "string") {
				throw new Error("Number of people must be a number");
			}
			return true;
		})
		.isInt({ min: 1, max: 20 })
		.withMessage("Number of people must be between 1 and 20")
		.toInt(),

	// Date/time format validation
	body("data.reservation_date")
		.exists()
		.withMessage("Reservation date is required")
		.notEmpty()
		.withMessage("Reservation date is required")
		.matches(REGEX.DATE)
		.withMessage("Reservation date must be a valid date in YYYY-MM-DD format")
		.custom((value) => {
			if (!DateTimeUtils.isValidDate(value)) {
				throw new Error(
					"Reservation date must be a valid date in YYYY-MM-DD format"
				);
			}
			return true;
		}),

	body("data.reservation_time")
		.exists()
		.withMessage("Reservation time is required")
		.notEmpty()
		.withMessage("Reservation time is required")
		.matches(REGEX.TIME)
		.withMessage("Reservation time must be a valid time in HH:MM format")
		.custom((value) => {
			if (!DateTimeUtils.isValidTime(value)) {
				throw new Error(
					"Reservation time must be a valid time in HH:MM format"
				);
			}
			return true;
		}),

	// Status validation
	body("data.status")
		.optional()
		.custom((value) => {
			if (
				value === RESERVATION_STATUS.SEATED ||
				value === RESERVATION_STATUS.FINISHED
			) {
				throw new Error(`Cannot create reservation with status '${value}'`);
			}
			if (value && value !== RESERVATION_STATUS.BOOKED) {
				throw new Error(
					"Status must be one of: booked, seated, finished, cancelled"
				);
			}
			return true;
		}),

	// Business rules validation
	body("data.reservation_date").custom((value) => {
		if (!DateTimeUtils.isFutureDate(value)) {
			throw new Error("Reservation date must be in the future");
		}
		if (DateTimeUtils.isClosedDay(value)) {
			throw new Error("Restaurant is closed on Tuesdays");
		}
		return true;
	}),

	body("data.reservation_time").custom((value, { req }) => {
		const date = req.body.data.reservation_date;

		if (!DateTimeUtils.isWithinBusinessHours(value)) {
			throw new Error(
				"Reservation time must be during business hours (10:30 AM - 9:30 PM)"
			);
		}

		if (!DateTimeUtils.isBeforeLastSeating(value)) {
			throw new Error(
				"Reservation time must be before 9:30 PM for last seating"
			);
		}

		if (DateTimeUtils.isPastDateTime(date, value)) {
			throw new Error("Reservation time must be in the future");
		}

		return true;
	}),
];

/**
 * Validation rules for updating reservation status
 */
const statusValidationRules = [
	body("data")
		.exists()
		.withMessage("Request body must contain a data object")
		.notEmpty()
		.withMessage("Request body must contain a data object")
		.isObject()
		.withMessage("Request body must contain a data object"),

	body("data.status")
		.exists()
		.withMessage("Status is required")
		.notEmpty()
		.withMessage("Status is required")
		.isIn(Object.values(RESERVATION_STATUS))
		.withMessage("Status must be one of: booked, seated, finished, cancelled"),
];

/**
 * Validation rules for searching reservations
 */
const searchValidationRules = [
	query("mobile_number")
		.optional()
		.trim()
		.customSanitizer(PhoneNumberUtils.normalize),

	query("date")
		.optional()
		.matches(REGEX.DATE)
		.withMessage("Date must be in YYYY-MM-DD format")
		.custom((value) => {
			if (!DateTimeUtils.isValidDate(value)) {
				throw new Error("Date must be a valid date in YYYY-MM-DD format");
			}
			return true;
		}),
];

module.exports = {
	checkValidation,
	reservationValidationRules,
	statusValidationRules,
	searchValidationRules,
};
