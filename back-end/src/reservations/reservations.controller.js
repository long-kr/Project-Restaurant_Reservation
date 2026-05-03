const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { logger } = require("../config/logger");
const { RESERVATION_STATUS, HTTP_STATUS } = require("../constants");
const { ErrorFactory } = require("../errors/AppError");
const {
	checkValidation,
	reservationValidationRules,
	statusValidationRules,
	searchValidationRules,
} = require("../validators/reservationValidator");

/**
 * Middleware to check if reservation exists
 */
async function reservationExists(req, res, next) {
	const { reservation_id } = req.params;

	try {
		const reservation = await service.read(reservation_id);

		if (!reservation) {
			throw ErrorFactory.notFound(
				`Cannot find reservation ID: ${reservation_id}`
			);
		}

		res.locals.reservation = reservation;
		next();
	} catch (error) {
		next(error);
	}
}

/**
 * Middleware to check if reservation is already seated
 */
function isNotSeated(req, res, next) {
	const { status } = req.body.data;
	if (status === RESERVATION_STATUS.SEATED) {
		return next(ErrorFactory.badRequest("Reservation is already seated"));
	}
	next();
}

/**
 * Middleware to check if reservation is already finished
 */
function isNotFinished(req, res, next) {
	const { status } = req.body.data;
	if (status === RESERVATION_STATUS.FINISHED) {
		return next(ErrorFactory.badRequest("Reservation is already finished"));
	}
	next();
}

/**
 * Middleware to validate current reservation status for updates
 */
function validCurrentStatus(req, res, next) {
	const reservation = res.locals.reservation;
	const newStatus = req.body.data.status;

	// Business rules for status transitions
	if (reservation.status === RESERVATION_STATUS.FINISHED) {
		return next(
			ErrorFactory.badRequest("Cannot update a finished reservation")
		);
	}

	if (
		newStatus === RESERVATION_STATUS.SEATED &&
		reservation.status !== RESERVATION_STATUS.BOOKED
	) {
		return next(
			ErrorFactory.badRequest("Only booked reservations can be seated")
		);
	}

	if (
		newStatus === RESERVATION_STATUS.FINISHED &&
		reservation.status !== RESERVATION_STATUS.SEATED
	) {
		return next(
			ErrorFactory.badRequest("Only seated reservations can be finished")
		);
	}

	next();
}

/**
 * List reservations with optional filtering
 */
async function list(req, res, next) {
	const { date, mobile_number } = req.query;

	try {
		let reservations;

		if (mobile_number) {
			logger.info(`Searching reservations by mobile number: ${mobile_number}`);
			reservations = await service.search(mobile_number);
		} else {
			const searchDate = date || new Date().toISOString().split("T")[0];
			logger.info(`Listing reservations for date: ${searchDate}`);
			reservations = await service.list(searchDate);
		}

		res.status(HTTP_STATUS.OK).json({ data: reservations });
	} catch (error) {
		logger.error("Error listing reservations:", error);
		next(ErrorFactory.internal("Failed to retrieve reservations"));
	}
}

/**
 * Read a specific reservation
 */
async function read(req, res) {
	const reservation = res.locals.reservation;

	logger.info(`Retrieved reservation: ${reservation.reservation_id}`);
	res.status(HTTP_STATUS.OK).json({ data: reservation });
}

/**
 * Create a new reservation
 */
async function create(req, res, next) {
	const reservationData = req.body.data;

	try {
		logger.info("Creating new reservation:", reservationData);
		const newReservation = await service.create(reservationData);

		logger.info(
			`Created reservation with ID: ${newReservation.reservation_id}`
		);
		res.status(HTTP_STATUS.CREATED).json({ data: newReservation });
	} catch (error) {
		logger.error("Error creating reservation:", error);
		next(ErrorFactory.internal("Failed to create reservation"));
	}
}

/**
 * Update an existing reservation
 */
async function update(req, res, next) {
	const reservation = res.locals.reservation;
	const updateData = {
		...req.body.data,
		reservation_id: reservation.reservation_id,
	};

	try {
		logger.info(
			`Updating reservation ${reservation.reservation_id}:`,
			updateData
		);
		const updatedReservation = await service.update(updateData);

		logger.info(`Updated reservation: ${updatedReservation.reservation_id}`);
		res.status(HTTP_STATUS.OK).json({ data: updatedReservation });
	} catch (error) {
		logger.error("Error updating reservation:", error);
		next(ErrorFactory.internal("Failed to update reservation"));
	}
}

/**
 * Update reservation status only
 */
async function updateStatus(req, res, next) {
	const reservation = res.locals.reservation;
	const { status } = req.body.data;

	const updateData = {
		...reservation,
		status,
	};

	try {
		logger.info(
			`Updating reservation ${reservation.reservation_id} status to: ${status}`
		);
		const updatedReservation = await service.update(updateData);

		logger.info(
			`Updated reservation status: ${updatedReservation.reservation_id}`
		);
		res.status(HTTP_STATUS.OK).json({ data: updatedReservation });
	} catch (error) {
		logger.error("Error updating reservation status:", error);
		next(ErrorFactory.internal("Failed to update reservation status"));
	}
}

// Export controller methods with middleware chains
module.exports = {
	list: [searchValidationRules, checkValidation, asyncErrorBoundary(list)],
	create: [
		reservationValidationRules,
		checkValidation,
		isNotSeated,
		isNotFinished,
		asyncErrorBoundary(create),
	],
	read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
	update: [
		asyncErrorBoundary(reservationExists),
		reservationValidationRules,
		checkValidation,
		isNotSeated,
		isNotFinished,
		asyncErrorBoundary(update),
	],
	updateStatus: [
		asyncErrorBoundary(reservationExists),
		statusValidationRules,
		checkValidation,
		validCurrentStatus,
		asyncErrorBoundary(updateStatus),
	],
};
