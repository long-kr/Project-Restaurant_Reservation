const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { logger } = require("../config/logger");
const { HTTP_STATUS, RESERVATION_STATUS } = require("../constants");
const { ErrorFactory } = require("../errors/AppError");
const {
	checkValidation,
	tableValidationRules,
	tableUpdateValidationRules,
	tableParamValidationRules,
} = require("../validators/tableValidator");

/**
 * Middleware to ensure request has data object
 */
function hasData(req, res, next) {
	if (!req.body.data) {
		next(ErrorFactory.badRequest("Request body must contain a data object"));
	}
	next();
}

/**
 * Middleware to check if table exists
 */
async function tableExists(req, res, next) {
	const { table_id } = req.params;

	try {
		const table = await service.read(table_id);

		if (!table) {
			throw ErrorFactory.notFound(`Table ID cannot be found: ${table_id}`);
		}

		res.locals.table = table;
		next();
	} catch (error) {
		next(error);
	}
}

/**
 * Middleware to validate table name
 */
function validTableName(req, res, next) {
	const { table_name } = req.body.data;

	if (!table_name || table_name.trim().length < 2) {
		throw ErrorFactory.validation(
			"table_name must be at least 2 characters long"
		);
	}

	next();
}

/**
 * Middleware to validate table capacity
 */
function validCapacity(req, res, next) {
	const { capacity } = req.body.data;

	if (!capacity || capacity < 1) {
		throw ErrorFactory.validation("capacity must be a positive integer");
	}

	next();
}

/**
 * Middleware to validate reservation ID exists
 */
function validReservationId(req, res, next) {
	const { reservation_id } = req.body.data;

	if (!reservation_id) {
		throw ErrorFactory.badRequest("reservation_id is required");
	}

	next();
}

/**
 * Middleware to check if reservation exists
 */
async function reservationExists(req, res, next) {
	const { reservation_id } = req.body.data;

	try {
		const reservation = await reservationService.read(reservation_id);

		if (!reservation) {
			throw ErrorFactory.notFound(`Reservation ${reservation_id} not found`);
		}

		res.locals.reservation = reservation;
		next();
	} catch (error) {
		next(error);
	}
}

/**
 * Middleware to validate update properties
 */
function validUpdateProperty(req, res, next) {
	const { reservation_id } = req.body.data;

	if (!reservation_id) {
		throw ErrorFactory.badRequest(
			"reservation_id is required for table updates"
		);
	}

	next();
}

/**
 * Middleware to check if table has sufficient capacity
 */
function sufficientCapacity(req, res, next) {
	const table = res.locals.table;
	const reservation = res.locals.reservation;

	if (table.capacity < reservation.people) {
		throw ErrorFactory.validation(
			`Table capacity (${table.capacity}) is insufficient for party size (${reservation.people})`
		);
	}

	next();
}

/**
 * Middleware to check if table is available (not occupied)
 */
function isTableAvailable(req, res, next) {
	const table = res.locals.table;

	if (table.reservation_id) {
		throw ErrorFactory.badRequest("Table is already occupied");
	}

	next();
}

/**
 * Middleware to check if reservation is not already seated
 */
function isReservationNotSeated(req, res, next) {
	const reservation = res.locals.reservation;

	if (reservation.status === RESERVATION_STATUS.SEATED) {
		throw ErrorFactory.badRequest("Reservation is already seated");
	}

	next();
}

/**
 * Middleware to check if table is occupied (for finishing)
 */
function isTableOccupied(req, res, next) {
	const table = res.locals.table;

	if (!table.reservation_id) {
		throw ErrorFactory.badRequest("Table is not occupied");
	}

	next();
}

/**
 * List all tables
 */
async function list(req, res) {
	try {
		logger.info("Listing all tables");
		const tables = await service.list();

		res.status(HTTP_STATUS.OK).json({ data: tables });
	} catch (error) {
		logger.error("Error listing tables:", error);
		throw ErrorFactory.internal("Failed to retrieve tables");
	}
}

/**
 * Read a specific table
 */
async function read(req, res) {
	const table = res.locals.table;

	logger.info(`Retrieved table: ${table.table_id}`);
	res.status(HTTP_STATUS.OK).json({ data: table });
}

/**
 * Create a new table
 */
async function create(req, res) {
	const tableData = req.body.data;

	try {
		logger.info("Creating new table:", tableData);
		const newTable = await service.create(tableData);

		logger.info(`Created table with ID: ${newTable.table_id}`);
		res.status(HTTP_STATUS.CREATED).json({ data: newTable });
	} catch (error) {
		logger.error("Error creating table:", error);
		throw ErrorFactory.internal("Failed to create table");
	}
}

/**
 * Update table (seat reservation)
 */
async function update(req, res) {
	const table = res.locals.table;
	const reservation = res.locals.reservation;

	try {
		logger.info(
			`Seating reservation ${reservation.reservation_id} at table ${table.table_id}`
		);

		// Update table with reservation
		const updatedTable = await service.update({
			...table,
			reservation_id: reservation.reservation_id,
		});

		// Update reservation status to seated
		await reservationService.update({
			...reservation,
			status: RESERVATION_STATUS.SEATED,
		});

		logger.info(
			`Successfully seated reservation ${reservation.reservation_id}`
		);
		res.status(HTTP_STATUS.OK).json({ data: updatedTable });
	} catch (error) {
		logger.error("Error seating reservation:", error);
		throw ErrorFactory.internal("Failed to seat reservation");
	}
}

/**
 * Finish table (clear reservation)
 */
async function finish(req, res) {
	const table = res.locals.table;

	try {
		logger.info(`Finishing table ${table.table_id}`);

		// Get the reservation to update its status
		if (table.reservation_id) {
			const reservation = await reservationService.read(table.reservation_id);

			if (!reservation) {
				throw ErrorFactory.notFound(
					`Reservation ${table.reservation_id} not found`
				);
			}

			await reservationService.update({
				...reservation,
				status: RESERVATION_STATUS.FINISHED,
			});
		}

		// Clear the table
		const updatedTable = await service.update({
			...table,
			reservation_id: null,
		});

		logger.info(`Successfully finished table ${table.table_id}`);
		res.status(HTTP_STATUS.OK).json({ data: updatedTable });
	} catch (error) {
		logger.error("Error finishing table:", error);
		throw ErrorFactory.internal("Failed to finish table");
	}
}

/**
 * Delete a table
 */
async function destroy(req, res) {
	const { table_id } = req.params;

	try {
		logger.info(`Deleting table: ${table_id}`);
		await service.destroy(table_id);

		logger.info(`Successfully deleted table: ${table_id}`);
		res.status(HTTP_STATUS.NO_CONTENT).send();
	} catch (error) {
		logger.error("Error deleting table:", error);
		throw ErrorFactory.internal("Failed to delete table");
	}
}

// Export controller methods with middleware chains
module.exports = {
	list: [asyncErrorBoundary(list)],

	read: [
		tableParamValidationRules,
		checkValidation,
		asyncErrorBoundary(tableExists),
		asyncErrorBoundary(read),
	],

	create: [
		hasData,
		tableValidationRules,
		checkValidation,
		validTableName,
		validCapacity,
		asyncErrorBoundary(create),
	],

	update: [
		hasData,
		tableParamValidationRules,
		tableUpdateValidationRules,
		checkValidation,
		asyncErrorBoundary(tableExists),
		validReservationId,
		asyncErrorBoundary(reservationExists),
		validUpdateProperty,
		sufficientCapacity,
		isTableAvailable,
		isReservationNotSeated,
		asyncErrorBoundary(update),
	],

	finish: [
		tableParamValidationRules,
		checkValidation,
		asyncErrorBoundary(tableExists),
		isTableOccupied,
		asyncErrorBoundary(finish),
	],

	destroy: [
		tableParamValidationRules,
		checkValidation,
		asyncErrorBoundary(tableExists),
		asyncErrorBoundary(destroy),
	],
};
