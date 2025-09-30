const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const moment = require("moment");
const { hasProperties } = require("../util/helper");
const {
	checkValidation,
	reservationValidationRules,
	statusValidationRules,
	searchValidationRules,
} = require("../util/validation");

/**
 * Validation input data
 */
async function reservationExist(req, res, next) {
	const { reservation_id } = req.params;

	const reservation = await service.read(reservation_id);

	if (!reservation) {
		return next({
			status: 404,
			message: `Cannot find reservation ID: ${reservation_id}`,
		});
	}

	res.locals.reservation = reservation;
	next();
}

function isSeated(req, res, next) {
	const { status } = req.body.data;
	if (status === "seated") {
		return next({
			status: 400,
			message: `Reservation is already seated`,
		});
	}

	next();
}

function isFinished(req, res, next) {
	const { status } = req.body.data;
	if (status === "finished") {
		return next({
			status: 400,
			message: `Reservation is already finished`,
		});
	}

	next();
}

function validCurrentStatus(req, res, next) {
	const { status } = res.locals.reservation;

	if (status === "finished") {
		return next({
			status: 400,
			message: `a finished reservation cannot be updated`,
		});
	}

	next();
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
	const { date = new Date(), mobile_number } = req.query;

	if (mobile_number) {
		const reservations = await service.search(mobile_number);
		res.json({ data: reservations });
		return;
	}

	res.json({
		data: await service.list(date),
	});
}

/**
 * Read handler for table resources
 */
async function read(req, res) {
	res.json({ data: res.locals.reservation });
}

/**
 * Create handler for creating reservation
 */
async function create(req, res) {
	const newReservation = req.body.data;
	res.status(201).json({
		data: await service.create(newReservation),
	});
}

/**
 * Update handler for status update
 */
async function update(req, res) {
	const updateReservation = {
		...req.body.data,
		reservation_id: res.locals.reservation.reservation_id,
	};

	const updated = await service.update(updateReservation);

	res.status(200).json({ data: updated });
}

module.exports = {
	list: [searchValidationRules, checkValidation, asyncErrorBoundary(list)],
	create: [
		reservationValidationRules,
		checkValidation,
		isSeated,
		isFinished,
		asyncErrorBoundary(create),
	],
	read: [asyncErrorBoundary(reservationExist), asyncErrorBoundary(read)],
	update: [
		asyncErrorBoundary(reservationExist),
		reservationValidationRules,
		checkValidation,
		isSeated,
		isFinished,
		asyncErrorBoundary(update),
	],
	updateStatus: [
		asyncErrorBoundary(reservationExist),
		statusValidationRules,
		checkValidation,
		validCurrentStatus,
		asyncErrorBoundary(update),
	],
};
