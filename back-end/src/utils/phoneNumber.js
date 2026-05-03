const { REGEX } = require("../constants");

/**
 * Phone Number utility functions
 */
class PhoneNumberUtils {
	/**
	 * Format phone number to XXX-XXX-XXXX format
	 * @param {string} phoneNumber - Raw phone number
	 * @returns {string} - Formatted phone number
	 */
	static format(phoneNumber) {
		if (!phoneNumber) {
			return "";
		}

		// Remove all non-numeric characters
		const cleaned = phoneNumber.replace(/\D/g, "");

		// Format as XXX-XXX-XXXX
		if (cleaned.length === 10) {
			return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
		}

		return phoneNumber; // Return original if not 10 digits
	}

	/**
	 * Remove formatting from phone number
	 * @param {string} phoneNumber - Formatted phone number
	 * @returns {string} - Digits only
	 */
	static removeFormatting(phoneNumber) {
		if (!phoneNumber) {
			return "";
		}
		return phoneNumber.replace(/\D/g, "");
	}

	/**
	 * Validate phone number format
	 * @param {string} phoneNumber - Phone number to validate
	 * @returns {boolean}
	 */
	static isValid(phoneNumber) {
		if (!phoneNumber) {
			return false;
		}

		// Check if it's already formatted
		if (REGEX.MOBILE_PHONE.test(phoneNumber)) {
			return true;
		}

		// Check if it's 10 digits
		const cleaned = PhoneNumberUtils.removeFormatting(phoneNumber);
		return REGEX.MOBILE_PHONE_DIGITS.test(cleaned);
	}

	/**
	 * Normalize phone number (remove formatting then reformat)
	 * @param {string} phoneNumber - Phone number to normalize
	 * @returns {string} - Normalized phone number
	 */
	static normalize(phoneNumber) {
		const cleaned = PhoneNumberUtils.removeFormatting(phoneNumber);
		return PhoneNumberUtils.format(cleaned);
	}

	/**
	 * Create search pattern for database queries
	 * @param {string} phoneNumber - Phone number to search for
	 * @returns {string} - Search pattern
	 */
	static createSearchPattern(phoneNumber) {
		const cleaned = PhoneNumberUtils.removeFormatting(phoneNumber);
		return `%${cleaned}%`;
	}
}

module.exports = PhoneNumberUtils;
