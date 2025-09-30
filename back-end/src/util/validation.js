const { body, param, query, validationResult } = require("express-validator");
const moment = require("moment");

// Validation middleware to check results
const checkValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Group errors by field for clearer error messages
		const errorsByField = errors.array().reduce((acc, error) => {
			if (!acc.includes(error.msg)) {
				acc.push(error.msg);
			}
			return acc;
		}, []);
		return res.status(400).json({ error: errorsByField });
	}
	next();
};

// Sanitize and validate mobile number
const sanitizeMobileNumber = (number) => {
	if (!number) return "";
	// Remove all non-numeric characters
	const cleaned = number.replace(/\D/g, "");
	// Format as XXX-XXX-XXXX
	return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
};

// Common validation rules for reservations
const reservationValidationRules = [
	// Data object validation
	body("data")
		.exists()
		.withMessage("data")
		.notEmpty()
		.withMessage("data")
		.isObject()
		.withMessage("data"),

	// Basic field validations
	body("data.first_name")
		.exists()
		.withMessage("first_name")
		.notEmpty()
		.withMessage("first_name")
		.isLength({ min: 2 })
		.withMessage("first_name"),

	body("data.last_name")
		.exists()
		.withMessage("last_name")
		.notEmpty()
		.withMessage("last_name")
		.isLength({ min: 2 })
		.withMessage("last_name"),

	body("data.mobile_number")
		.exists()
		.withMessage("mobile_number")
		.notEmpty()
		.withMessage("mobile_number")
		.custom((value) => {
			const numericValue = value.replace(/\D/g, "");
			if (numericValue.length !== 10) {
				throw new Error("mobile_number");
			}
			return true;
		})
		.customSanitizer(sanitizeMobileNumber),

	// People validation (must come before business rules)
	body("data.people")
		.exists()
		.withMessage("people")
		.notEmpty()
		.withMessage("people")
		.custom((value) => {
			if (typeof value === "string") {
				throw new Error("people");
			}
			return true;
		})
		.isInt({ min: 1 })
		.withMessage("people")
		.toInt(),

	// Date/time format validation
	body("data.reservation_date")
		.exists()
		.withMessage("reservation_date")
		.notEmpty()
		.withMessage("reservation_date")
		.matches(/^\d{4}-\d{2}-\d{2}$/)
		.withMessage("reservation_date"),

	body("data.reservation_time")
		.exists()
		.withMessage("reservation_time")
		.notEmpty()
		.withMessage("reservation_time")
		.matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
		.withMessage("reservation_time"),

	// Status validation
	body("data.status")
		.optional()
		.custom((value) => {
			if (value === "seated" || value === "finished") {
				throw new Error(value);
			}
			if (value && value !== "booked") {
				throw new Error("unknown");
			}
			return true;
		}),

	// Business rules validation
	body("data.reservation_date").custom((value) => {
		const date = moment(value, "YYYY-MM-DD", true);
		if (!date.isValid()) {
			throw new Error("reservation_date");
		}
		if (date.isBefore(moment().startOf("day"))) {
			throw new Error("future");
		}
		if (date.day() === 2) {
			throw new Error("closed");
		}
		return true;
	}),

	body("data.reservation_time").custom((value, { req }) => {
		const date = moment(req.body.data.reservation_date, "YYYY-MM-DD");
		const time = moment(value, "HH:mm");
		const dateTime = date.clone().hours(time.hours()).minutes(time.minutes());

		const openingTime = date.clone().hours(10).minutes(30);
		const closingTime = date.clone().hours(21).minutes(30);
		const lastSeatingTime = date.clone().hours(20).minutes(30);

		if (dateTime.isBefore(openingTime)) {
			throw new Error("reservation_time");
		}
		if (dateTime.isAfter(closingTime)) {
			throw new Error("reservation_time");
		}
		if (dateTime.isAfter(lastSeatingTime)) {
			throw new Error("reservation_time");
		}

		if (date.isSame(moment(), "day") && dateTime.isBefore(moment())) {
			throw new Error("reservation_time");
		}

		return true;
	}),
];

// Validation rules for updating reservation status
const statusValidationRules = [
	body("data")
		.exists()
		.withMessage("data")
		.notEmpty()
		.withMessage("data")
		.isObject()
		.withMessage("data"),

	body("data.status")
		.exists()
		.withMessage("status")
		.notEmpty()
		.withMessage("status")
		.isIn(["booked", "seated", "finished", "cancelled"])
		.withMessage("unknown"),
];

// Validation rules for searching reservations
const searchValidationRules = [
	query("mobile_number")
		.optional()
		.trim()
		.customSanitizer(sanitizeMobileNumber),

	query("date")
		.optional()
		.matches(/^\d{4}-\d{2}-\d{2}$/)
		.withMessage("Date must be in YYYY-MM-DD format")
		.custom((value) => {
			const date = moment(value, "YYYY-MM-DD", true);
			if (!date.isValid()) {
				throw new Error("Invalid date format");
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