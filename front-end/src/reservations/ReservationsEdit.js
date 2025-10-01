import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorAlert } from "../components/layout";
import { Loading } from "../components/ui";
import { useReservation, useUpdateReservation } from "../hooks/useReservations";
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
	const updateReservationMutation = useUpdateReservation();

	const [reservation, setReservation] = useState({ ...initialReservation });
	const [error, setError] = useState(null);

	// Fetch reservation data using React Query
	const {
		data: reservationData,
		isLoading,
		error: fetchError,
	} = useReservation(reservation_id);

	// Update local state when data is fetched
	useEffect(() => {
		if (reservationData) {
			const formattedData = {
				...reservationData,
				reservation_date: formatAsDate(reservationData.reservation_date),
			};
			setReservation(formattedData);
		}
	}, [reservationData]);

	const changeHandler = ({ target: { name, value } }) => {
		setReservation((preReservation) => ({
			...preReservation,
			[name]: value,
		}));
	};

	const submitHandler = (e) => {
		e.preventDefault();
		setError(null);
		reservation.people = parseInt(reservation.people);

		updateReservationMutation.mutate(
			{
				reservationId: reservation_id,
				data: reservation,
			},
			{
				onSuccess: () => {
					navigate(`${routes.dashboard}?date=${reservation.reservation_date}`);
				},
				onError: (errors) => {
					setError([errors]);
				},
			}
		);
	};

	if (isLoading) {
		return <Loading />;
	}

	if (fetchError) {
		return (
			<div>
				<h4>Error loading reservation</h4>
				<ErrorAlert error={fetchError} />
			</div>
		);
	}

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
