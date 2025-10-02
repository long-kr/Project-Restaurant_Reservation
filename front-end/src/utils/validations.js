import { validationRules } from "../hooks/useFormValidation";
import {
	getWeekDay,
	isNotPastTime,
	isReservationTimeValid,
	today,
} from "./date-time";

export const reservationRules = {
	first_name: [
		validationRules.required("First name is required"),
		validationRules.minLength(2, "First name must be at least 2 characters"),
	],
	last_name: [
		validationRules.required("Last name is required"),
		validationRules.minLength(2, "Last name must be at least 2 characters"),
	],
	mobile_number: [
		validationRules.required("Mobile number is required"),
		validationRules.phone(
			"Please enter a valid phone number (e.g., 123-456-7890)"
		),
	],
	people: [
		validationRules.required("Number of people is required"),
		validationRules.min(1, "Must be at least 1 person"),
		validationRules.max(20, "Cannot exceed 20 people"),
	],
	reservation_date: [
		validationRules.required("Reservation date is required"),
		validationRules.custom((dateInput) => {
			if (dateInput < today()) {
				return "Reservation date cannot be in the past";
			}
			return true;
		}, "Reservation date cannot be in the past"),
		validationRules.custom((dateInput) => {
			const weekDay = getWeekDay(dateInput);
			if (weekDay === 2) {
				return "Reservation date cannot be Tuesday (restaurant is closed)";
			}
			return true;
		}, "Cannot make reservations on Tuesday"),
	],
	reservation_time: [
		validationRules.required("Reservation time is required"),
		validationRules.custom(
			isReservationTimeValid,
			"Reservation time must be between 10:30 AM and 9:30 PM"
		),
		validationRules.custom(
			(timeInput, allValues) =>
				isNotPastTime(timeInput, allValues.reservation_date),
			"Cannot make reservations for past times on the same day"
		),
	],
};

export const tableRules = {
	table_name: [
		validationRules.required("Table name is required"),
		validationRules.minLength(2, "Table name must be at least 2 characters"),
	],
	capacity: [
		validationRules.required("Capacity is required"),
		validationRules.min(1, "Capacity must be at least 1 person"),
	],
};
