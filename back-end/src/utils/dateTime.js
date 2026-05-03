const moment = require("moment");
const { BUSINESS_RULES, DATE_FORMATS } = require("../constants");

/**
 * Date and Time utility functions
 */
class DateTimeUtils {
	/**
	 * Check if a date is valid
	 * @param {string} dateString - Date in YYYY-MM-DD format
	 * @returns {boolean}
	 */
	static isValidDate(dateString) {
		const date = moment(dateString, DATE_FORMATS.DATE, true);
		return date.isValid();
	}

	/**
	 * Check if a time is valid
	 * @param {string} timeString - Time in HH:mm format
	 * @returns {boolean}
	 */
	static isValidTime(timeString) {
		const time = moment(timeString, DATE_FORMATS.TIME, true);
		return time.isValid();
	}

	/**
	 * Check if a date is in the future
	 * @param {string} dateString - Date in YYYY-MM-DD format
	 * @returns {boolean}
	 */
	static isFutureDate(dateString) {
		const date = moment(dateString, DATE_FORMATS.DATE);
		return date.isSameOrAfter(moment().startOf("day"));
	}

	/**
	 * Check if a date falls on a closed day
	 * @param {string} dateString - Date in YYYY-MM-DD format
	 * @returns {boolean}
	 */
	static isClosedDay(dateString) {
		const date = moment(dateString, DATE_FORMATS.DATE);
		return BUSINESS_RULES.CLOSED_DAYS.includes(date.day());
	}

	/**
	 * Check if a time is within business hours
	 * @param {string} timeString - Time in HH:mm format
	 * @returns {boolean}
	 */
	static isWithinBusinessHours(timeString) {
		const time = moment(timeString, DATE_FORMATS.TIME);
		const opening = moment(
			BUSINESS_RULES.RESTAURANT_HOURS.OPENING,
			DATE_FORMATS.TIME
		);
		const closing = moment(
			BUSINESS_RULES.RESTAURANT_HOURS.CLOSING,
			DATE_FORMATS.TIME
		);

		return time.isBetween(opening, closing, null, "[]");
	}

	/**
	 * Check if a time is before last seating
	 * @param {string} timeString - Time in HH:mm format
	 * @returns {boolean}
	 */
	static isBeforeLastSeating(timeString) {
		const time = moment(timeString, DATE_FORMATS.TIME);
		const lastSeating = moment(
			BUSINESS_RULES.RESTAURANT_HOURS.LAST_SEATING,
			DATE_FORMATS.TIME
		);

		return time.isSameOrBefore(lastSeating);
	}

	/**
	 * Check if a reservation date/time is in the past
	 * @param {string} dateString - Date in YYYY-MM-DD format
	 * @param {string} timeString - Time in HH:mm format
	 * @returns {boolean}
	 */
	static isPastDateTime(dateString, timeString) {
		const reservationDateTime = moment(
			`${dateString} ${timeString}`,
			`${DATE_FORMATS.DATE} ${DATE_FORMATS.TIME}`
		);
		return reservationDateTime.isBefore(moment());
	}

	/**
	 * Format date to standard format
	 * @param {Date|string} date - Date object or string
	 * @returns {string} - Formatted date string
	 */
	static formatDate(date) {
		return moment(date).format(DATE_FORMATS.DATE);
	}

	/**
	 * Format time to standard format
	 * @param {string} time - Time string
	 * @returns {string} - Formatted time string
	 */
	static formatTime(time) {
		return moment(time, DATE_FORMATS.TIME).format(DATE_FORMATS.TIME);
	}

	/**
	 * Get current date in standard format
	 * @returns {string}
	 */
	static getCurrentDate() {
		return moment().format(DATE_FORMATS.DATE);
	}

	/**
	 * Get current time in standard format
	 * @returns {string}
	 */
	static getCurrentTime() {
		return moment().format(DATE_FORMATS.TIME);
	}
}

module.exports = DateTimeUtils;
