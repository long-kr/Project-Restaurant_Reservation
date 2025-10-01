import React from "react";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Form,
	FormActions,
	FormFieldGroup,
	Input,
} from "../components/ui";
import { useFormValidation } from "../hooks/useFormValidation";
import { useCreateReservation } from "../hooks/useReservations";
import { today } from "../utils/date-time";
import { reservationRules } from "../utils/validations";

const initialReservation = {
	first_name: "",
	last_name: "",
	mobile_number: "",
	people: "",
	reservation_date: "",
	reservation_time: "",
};

function ReservationCreate() {
	const navigate = useNavigate();
	const createReservationMutation = useCreateReservation();

	const onSubmit = (values) => {
		const reservationData = {
			...values,
			people: parseInt(values.people),
		};

		createReservationMutation.mutate(
			{ reservation: reservationData },
			{
				onSuccess: () => {
					navigate(`/dashboard?date=${values.reservation_date}`);
				},
				onError: (error) => {
					console.error("Reservation creation failed:", error);
				},
			}
		);
	};

	const { getFieldProps, handleSubmit, isValid } = useFormValidation(
		initialReservation,
		reservationRules,
		onSubmit
	);

	return (
		<div>
			<h4 className='h3 text-center mb-0'>Create New Reservation</h4>

			<Form onSubmit={handleSubmit}>
				<FormFieldGroup className='row'>
					<div className='col-md-6'>
						<Input
							type='text'
							label='First Name'
							placeholder='Customer first name'
							helpText='Minimum 2 characters'
							{...getFieldProps("first_name")}
						/>
					</div>
					<div className='col-md-6'>
						<Input
							type='text'
							label='Last Name'
							placeholder='Customer last name'
							helpText='Minimum 2 characters'
							{...getFieldProps("last_name")}
						/>
					</div>
				</FormFieldGroup>

				<FormFieldGroup className='row'>
					<div className='col-md-6'>
						<Input
							type='tel'
							label='Mobile Number'
							placeholder='xxx-xxx-xxxx'
							helpText='Format: xxx-xxx-xxxx'
							{...getFieldProps("mobile_number")}
						/>
					</div>
					<div className='col-md-6'>
						<Input
							type='number'
							label='Number of Guests'
							placeholder='How many guests?'
							min='1'
							max='20'
							helpText='Between 1 and 20 people'
							{...getFieldProps("people")}
						/>
					</div>
				</FormFieldGroup>

				<FormFieldGroup className='row'>
					<div className='col-md-6'>
						<Input
							type='date'
							label='Reservation Date'
							min={today()}
							helpText='Cannot be a past date or Tuesday'
							{...getFieldProps("reservation_date")}
						/>
					</div>
					<div className='col-md-6'>
						<Input
							type='time'
							label='Reservation Time'
							helpText='Between 10:30 AM and 9:30 PM'
							{...getFieldProps("reservation_time")}
						/>
					</div>
				</FormFieldGroup>

				<FormActions>
					<Button variant='dark' onClick={() => navigate(-1)} type='button'>
						Cancel
					</Button>

					<Button
						variant='dark'
						type='submit'
						loading={createReservationMutation.isPending}
						disabled={!isValid}
						className='border-left'
					>
						Submit
					</Button>
				</FormActions>
			</Form>
		</div>
	);
}

export default ReservationCreate;
