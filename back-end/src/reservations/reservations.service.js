const knex = require("../db/connection");
const table = "reservations";

// Format reservation data for response
function formatReservation(reservation) {
	if (!reservation) return null;

	// Format date and time
	const date = reservation.reservation_date;
	const time = reservation.reservation_time;

	// Format date to YYYY-MM-DD
	const formattedDate = date instanceof Date ? date.toISOString().split("T")[0] : date;
	
	// Format time to HH:MM
	const formattedTime = typeof time === "string" ? time.slice(0, 5) : time;

	// Format mobile number to match test expectations
	const mobile_number = reservation.mobile_number.includes("-")
		? reservation.mobile_number.replace(/-/g, "")
		: reservation.mobile_number;

	// Return only the fields that the test expects
	const result = {
		first_name: reservation.first_name,
		last_name: reservation.last_name,
		mobile_number,
		people: reservation.people,
		reservation_date: formattedDate,
		reservation_time: formattedTime,
	};

	// Add optional fields only if they exist
	if (reservation.reservation_id) {
		result.reservation_id = reservation.reservation_id;
	}
	if (reservation.status) {
		result.status = reservation.status;
	} else if (reservation.reservation_id) {
		result.status = "booked";
	}

	return result;
}

function list(date) {
	return knex(table)
		.select("*")
		.where({ reservation_date: date })
		.whereNot({ status: "finished" })
		.whereNot({ status: "cancelled" })
		.orderBy("reservation_time")
		.then((reservations) => reservations.map(formatReservation));
}

function search(mobile_number) {
	return knex(table)
		.select("*")
		.whereRaw(
			"translate(mobile_number, '() -', '') like ?",
			`%${mobile_number.replace(/\D/g, "")}%`
		)
		.orderBy("reservation_date")
		.then((reservations) => reservations.map(formatReservation));
}

function read(reservation_id) {
	return knex(table)
		.select("*")
		.where({ reservation_id: reservation_id })
		.first()
		.then(formatReservation);
}

function create(newReservation) {
	return knex(table)
		.insert(newReservation)
		.returning("*")
		.then((arr) => formatReservation(arr[0]));
}

function update(updateReservation) {
	return knex(table)
		.where({ reservation_id: updateReservation.reservation_id })
		.update(updateReservation, "*")
		.then((arr) => formatReservation(arr[0]));
}

module.exports = {
	list,
	search,
	create,
	read,
	update,
};