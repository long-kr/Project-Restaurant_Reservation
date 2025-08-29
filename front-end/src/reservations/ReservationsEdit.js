import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { getReservation, updateReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import { routes } from "../utils/routes";
import SubmitForm from "./SubmitForm";

function ReservationsEdit() {
	const initialReservation = {
		first_name: "",
		last_name: "",
		mobile_number: "",
		people: "",
		reservation_date: "",
		reservation_time: "",
	};

	const navigate = useNavigate();
	const { reservation_id } = useParams();
	const [reservation, setReservation] = useState({ ...initialReservation });
	const [error, setError] = useState(null);

	useEffect(loadReservation, [reservation_id]);

	function loadReservation() {
		const abortController = new AbortController();
		setError(null);
		getReservation(reservation_id, abortController.signal)
			.then((data) => {
				data.reservation_date = formatAsDate(data.reservation_date);
				setReservation(data);
			})
			.catch(setError);
		return () => abortController.abort();
	}

	const changeHandler = ({ target: { name, value } }) => {
		setReservation((preReservation) => ({
			...preReservation,
			[name]: value,
		}));
	};

	const submitHandler = (e) => {
		e.preventDefault();
		const abortController = new AbortController();
		setError(null);
		reservation.people = parseInt(reservation.people);
		updateReservation(reservation_id, reservation, abortController.signal)
			.then(() => {
				navigate(`${routes.dashboard}?date=${reservation.reservation_date}`);
			})
			.catch((errors) => setError([errors]));
		return () => abortController.abort();
	};

	return (
		<div>
			<h4>Editting reservation: ID {reservation_id}</h4>
			{error?.length &&
				error.map((err, i) => <ErrorAlert key={i} error={err} />)}
			<SubmitForm
				reservation={reservation}
				changeHandler={changeHandler}
				submitHandler={submitHandler}
			/>
		</div>
	);
}

export default ReservationsEdit;
