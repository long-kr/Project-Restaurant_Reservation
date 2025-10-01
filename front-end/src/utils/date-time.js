import moment from "moment";
const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

/**
 * Formats a Date object as YYYY-MM-DD.
 *
 * This function is *not* exported because the UI should generally avoid working directly with Date instance.
 * You may export this function if you need it.
 *
 * @param date
 *  an instance of a date object
 * @returns {string}
 *  the specified Date formatted as YYYY-MM-DD
 */
function asDateString(date) {
	return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
		.toString(10)
		.padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

/**
 * Format a date string in ISO-8601 format (which is what is returned from PostgreSQL) as YYYY-MM-DD.
 * @param dateString
 *  ISO-8601 date string
 * @returns {*}
 *  the specified date string formatted as YYYY-MM-DD
 */
export function formatAsDate(dateString) {
	return dateString.match(dateFormat)[0];
}

/**
 * Format a time string in HH:MM:SS format (which is what is returned from PostgreSQL) as HH:MM.
 * @param timeString
 *  HH:MM:SS time string
 * @returns {*}
 *  the specified time string formatted as YHH:MM.
 */
export function formatAsTime(timeString) {
	return timeString.match(timeFormat)[0];
}

/**
 * Today's date as YYYY-MM-DD.
 * @returns {*}
 *  the today's date formatted as YYYY-MM-DD
 */
export function today() {
	return moment().format("YYYY-MM-DD");
}

/**
 * Subtracts one day to the specified date and return it in as YYYY-MM-DD.
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the date one day prior to currentDate, formatted as YYYY-MM-DD
 */
export function previous(currentDate) {
	let [year, month, day] = currentDate.split("-");
	month -= 1;
	const date = new Date(year, month, day);
	date.setMonth(date.getMonth());
	date.setDate(date.getDate() - 1);
	return asDateString(date);
}

/**
 * Adds one day to the specified date and return it in as YYYY-MM-DD.
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the date one day after currentDate, formatted as YYYY-MM-DD
 */
export function next(currentDate) {
	let [year, month, day] = currentDate.split("-");
	month -= 1;
	const date = new Date(year, month, day);
	date.setMonth(date.getMonth());
	date.setDate(date.getDate() + 1);
	return asDateString(date);
}

/**
 * Get the week day of the specified date.
 * @param input
 *  a date string in YYYY-MM-DD format
 * @returns {*}
 *  the week day of the specified date
 */
export function getWeekDay(input) {
	const dateArray = input.split("-");
	const year = dateArray[0];
	const month = parseInt(dateArray[1], 10) - 1;
	const date = dateArray[2];
	const newDate = new Date(year, month, date);
	return newDate.getDay();
}

/**
 * Check if the reservation time is valid.
 * @param timeInput
 *  a time string in HH:MM format
 * @returns {*}
 *  true if the reservation time is valid, false otherwise
 */
export function isReservationTimeValid(timeInput) {
	const openTime = new Date().setHours(10, 30, 0);
	const closedTime = new Date().setHours(21, 30, 0);
	const hourInput = Number(timeInput.split(":")[0]);
	const minusInput = Number(timeInput.split(":")[1]);
	const reserveTime = new Date().setHours(hourInput, minusInput, 0);

	return reserveTime >= openTime && reserveTime <= closedTime;
}

/**
 * Check if the reservation time is not past the current time.
 * @param timeInput
 *  a time string in HH:MM format
 * @param dateInput
 *  a date string in YYYY-MM-DD format
 * @returns {*}
 *  true if the reservation time is not past the current time, false otherwise
 */
export function isNotPastTime(timeInput, dateInput) {
	if (dateInput !== today()) return true;

	const hourInput = Number(timeInput.split(":")[0]);
	const minusInput = Number(timeInput.split(":")[1]);
	const reserveTime = new Date().setHours(hourInput, minusInput, 0);
	const timeNow = new Date().getTime();

	return timeNow <= reserveTime;
}
