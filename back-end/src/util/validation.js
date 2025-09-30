const { body, param, query, validationResult } = require("express-validator");
const moment = require("moment");

// Validation middleware to check results
const checkValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			error: errors.array().map((err) => ({
				field: err.param,
				message: err.msg,
			})),
		});
	}
	next();
};

// Sanitize and validate mobile number
const sanitizeMobileNumber = (number) => {
	// Remove all non-numeric characters
	const cleaned = number.replace(/\D/g, "");
	// Format as XXX-XXX-XXXX
	return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
};

// Common validation rules for reservations
const reservationValidationRules = [
	body("data.first_name")
		.trim()
		.notEmpty()
		.withMessage("First name is required")
		.isLength({ min: 2 })
		.withMessage("First name must be at least 2 characters long")
		.escape(),

	body("data.last_name")
		.trim()
		.notEmpty()
		.withMessage("Last name is required")
		.isLength({ min: 2 })
		.withMessage("Last name must be at least 2 characters long")
		.escape(),

	body("data.mobile_number")
		.trim()
		.notEmpty()
		.withMessage("Mobile number is required")
		.custom((value) => {
			// Remove any non-numeric characters for validation
			const numericValue = value.replace(/\D/g, "");
			if (numericValue.length !== 10) {
				throw new Error("Mobile number must be exactly 10 digits");
			}
			return true;
		})
		.customSanitizer(sanitizeMobileNumber),

	body("data.people")
		.isInt({ min: 1 })
		.withMessage("Number of people must be a positive integer")
		.toInt(),

	body("data.reservation_date")
		.notEmpty()
		.withMessage("Reservation date is required")
		.matches(/^\d{4}-\d{2}-\d{2}$/)
		.withMessage("Reservation date must be in YYYY-MM-DD format")
		.custom((value) => {
			const date = moment(value);
			if (!date.isValid()) {
				throw new Error("Invalid reservation date");
			}
			if (date.isBefore(moment().startOf("day"))) {
				throw new Error("Reservation date must be in the future");
			}
			if (date.day() === 2) {
				// Tuesday
				throw new Error("Restaurant is closed on Tuesdays");
			}
			return true;
		}),

	body("data.reservation_time")
		.notEmpty()
		.withMessage("Reservation time is required")
		.matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
		.withMessage("Reservation time must be in HH:MM format")
		.custom((value, { req }) => {
			const date = moment(req.body.data.reservation_date);
			const time = moment(value, "HH:mm");
			const dateTime = date.clone().hours(time.hours()).minutes(time.minutes());

			const openingTime = date.clone().hours(10).minutes(30);
			const closingTime = date.clone().hours(21).minutes(30);
			const lastSeatingTime = date.clone().hours(20).minutes(30);

			if (dateTime.isBefore(openingTime)) {
				throw new Error("Restaurant is not open until 10:30 AM");
			}
			if (dateTime.isAfter(closingTime)) {
				throw new Error("Restaurant closes at 9:30 PM");
			}
			if (dateTime.isAfter(lastSeatingTime)) {
				throw new Error("Last seating is at 8:30 PM");
			}

			// If reservation is for today, check if time has already passed
			if (date.isSame(moment(), "day") && dateTime.isBefore(moment())) {
				throw new Error("Reservation time must be in the future");
			}

			return true;
		}),
];

// Validation rules for updating reservation status
const statusValidationRules = [
	body("data.status")
		.trim()
		.notEmpty()
		.withMessage("Status is required")
		.isIn(["booked", "seated", "finished", "cancelled"])
		.withMessage("Invalid status"),
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
		.withMessage("Date must be in YYYY-MM-DD format"),
];

module.exports = {
	checkValidation,
	reservationValidationRules,
	statusValidationRules,
	searchValidationRules,
};
