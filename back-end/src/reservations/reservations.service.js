const knex = require("../db/connection");
const { logger } = require("../config/logger");
const DateTimeUtils = require("../utils/dateTime");
const PhoneNumberUtils = require("../utils/phoneNumber");

const tableName = "reservations";

/**
 * List reservations for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of reservations
 */
function list(date) {
	logger.debug(`Querying reservations for date: ${date}`);

	return knex(tableName)
		.select("*")
		.where({ reservation_date: date })
		.whereNot({ status: "finished" })
		.orderBy("reservation_time")
		.then((reservations) => {
			return reservations.map(formatReservationResponse);
		});
}

/**
 * Search reservations by mobile number
 * @param {string} mobileNumber - Mobile number to search for
 * @returns {Promise<Array>} Array of matching reservations
 */
function search(mobileNumber) {
	const formattedNumber = PhoneNumberUtils.normalize(mobileNumber);
	logger.debug(`Searching reservations for mobile number: ${formattedNumber}`);

	return knex(tableName)
		.select("*")
		.where("mobile_number", "like", `%${formattedNumber}%`)
		.orderBy("reservation_date")
		.then((reservations) => {
			return reservations.map(formatReservationResponse);
		});
}

/**
 * Read a specific reservation by ID
 * @param {number} reservationId - Reservation ID
 * @returns {Promise<Object|null>} Reservation object or null if not found
 */
function read(reservationId) {
	logger.debug(`Reading reservation: ${reservationId}`);

	return knex(tableName)
		.select("*")
		.where({ reservation_id: reservationId })
		.first()
		.then((reservation) => {
			return reservation ? formatReservationResponse(reservation) : null;
		});
}

/**
 * Create a new reservation
 * @param {Object} reservation - Reservation data
 * @returns {Promise<Object>} Created reservation
 */
function create(reservation) {
	logger.debug("Creating reservation:", reservation);

	const formattedReservation = formatReservationForDatabase(reservation);

	return knex(tableName)
		.insert(formattedReservation)
		.returning("*")
		.then((createdReservations) => {
			const created = createdReservations[0];
			logger.info(`Created reservation with ID: ${created.reservation_id}`);
			return formatReservationResponse(created);
		});
}

/**
 * Update an existing reservation
 * @param {Object} updatedReservation - Updated reservation data
 * @returns {Promise<Object>} Updated reservation
 */
function update(updatedReservation) {
	const { reservation_id, ...updateData } = updatedReservation;
	logger.debug(`Updating reservation ${reservation_id}:`, updateData);

	const formattedData = formatReservationForDatabase(updateData);

	return knex(tableName)
		.where({ reservation_id })
		.update(formattedData)
		.returning("*")
		.then((updatedReservations) => {
			const updated = updatedReservations[0];
			logger.info(`Updated reservation: ${updated.reservation_id}`);
			return formatReservationResponse(updated);
		});
}

/**
 * Delete a reservation (soft delete by setting status to cancelled)
 * @param {number} reservationId - Reservation ID to delete
 * @returns {Promise<Object>} Updated reservation
 */
function destroy(reservationId) {
	logger.debug(`Cancelling reservation: ${reservationId}`);

	return knex(tableName)
		.where({ reservation_id: reservationId })
		.update({ status: "cancelled" })
		.returning("*")
		.then((cancelledReservations) => {
			const cancelled = cancelledReservations[0];
			logger.info(`Cancelled reservation: ${cancelled.reservation_id}`);
			return formatReservationResponse(cancelled);
		});
}

/**
 * Format reservation data for database storage
 * @param {Object} reservation - Raw reservation data
 * @returns {Object} Formatted reservation data
 */
function formatReservationForDatabase(reservation) {
	const formatted = { ...reservation };

	// Format date and time for database storage
	if (formatted.reservation_date) {
		formatted.reservation_date = DateTimeUtils.formatDate(
			formatted.reservation_date
		);
	}

	if (formatted.reservation_time) {
		formatted.reservation_time = DateTimeUtils.formatTime(
			formatted.reservation_time
		);
	}

	// Format mobile number
	if (formatted.mobile_number) {
		formatted.mobile_number = PhoneNumberUtils.normalize(
			formatted.mobile_number
		);
	}

	// Set default status if not provided
	if (!formatted.status) {
		formatted.status = "booked";
	}

	return formatted;
}

/**
 * Format reservation data for API response
 * @param {Object} reservation - Raw reservation from database
 * @returns {Object} Formatted reservation for response
 */
function formatReservationResponse(reservation) {
	if (!reservation) {
		return null;
	}

	const formatted = { ...reservation };

	// Ensure consistent date/time formatting
	if (formatted.reservation_date) {
		formatted.reservation_date = DateTimeUtils.formatDate(
			formatted.reservation_date
		);
	}

	if (formatted.reservation_time) {
		// Handle both HH:mm and HH:mm:ss formats from database
		const timeStr = formatted.reservation_time.toString();
		formatted.reservation_time = DateTimeUtils.formatTime(timeStr);
	}

	// Ensure mobile number is properly formatted
	if (formatted.mobile_number) {
		formatted.mobile_number = PhoneNumberUtils.normalize(
			formatted.mobile_number
		);
	}

	return formatted;
}

module.exports = {
	list,
	search,
	read,
	create,
	update,
	destroy,
};
