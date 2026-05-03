const { body, param } = require("express-validator");
const { checkValidation } = require("./validationErrorHandler");

/**
 * Validation rules for creating tables
 */
const tableValidationRules = [
	// Data object validation
	body("data")
		.exists()
		.withMessage("Request body must contain a data object")
		.notEmpty()
		.withMessage("Request body must contain a data object")
		.isObject()
		.withMessage("Request body must contain a data object"),

	// Table name validation
	body("data.table_name")
		.exists()
		.withMessage("Table name is required")
		.trim()
		.notEmpty()
		.withMessage("Table name is required")
		.isLength({ min: 2 })
		.withMessage("Table name must be at least 2 characters long"),

	// Capacity validation
	body("data.capacity")
		.exists()
		.withMessage("Capacity is required")
		.notEmpty()
		.withMessage("Capacity is required")
		.isInt({ min: 1 })
		.withMessage("Capacity must be a positive integer")
		.toInt(),
];

/**
 * Validation rules for table updates (seating/finishing)
 */
const tableUpdateValidationRules = [
	// Data object validation
	body("data")
		.exists()
		.withMessage("Request body must contain a data object")
		.notEmpty()
		.withMessage("Request body must contain a data object")
		.isObject()
		.withMessage("Request body must contain a data object"),

	// Reservation ID validation
	body("data.reservation_id")
		.exists()
		.withMessage("Reservation ID is required")
		.notEmpty()
		.withMessage("Reservation ID is required")
		.isInt({ min: 1 })
		.withMessage("Reservation ID must be a positive integer")
		.toInt(),
];

/**
 * Validation rules for table parameters
 */
const tableParamValidationRules = [
	param("table_id")
		.isInt({ min: 1 })
		.withMessage("Table ID must be a positive integer")
		.toInt(),
];

module.exports = {
	checkValidation,
	tableValidationRules,
	tableUpdateValidationRules,
	tableParamValidationRules,
};
