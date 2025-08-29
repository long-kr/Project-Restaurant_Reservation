import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Empty } from "../components/Empty";
import ReservationView from "../reservations/ReservationView";
import { searchReservationsByPhone, setReservationStatus } from "../utils/api";
import SearchForm from "./SearchForm";

/**
 * Defines the Search Page
 * @input phone number
 * @returns {JSX.Element}
 */
function Search() {
	const [phoneNumber, setPhoneNumer] = useState("");
	const [reservations, setReservations] = useState([]);

	const controllerRef = useRef(null);

	const changeHandler = (e) => {
		setPhoneNumer(e.target.value);
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		try {
			const abortController = new AbortController();
			controllerRef.current = abortController;

			const reservation = await searchReservationsByPhone(
				{ mobile_number: phoneNumber },
				abortController.signal
			);

			setReservations(reservation);
		} catch (error) {
			toast.error("No reservations found for this phone number.");
		}
	};

	function cancelReservationHandler(reservation_id) {
		if (
			window.confirm(
				"Do you want to cancel this reservation?\nThis cannot be undone."
			)
		) {
			const abortController = new AbortController();
			controllerRef.current = abortController;

			setReservationStatus(
				reservation_id,
				{ status: "cancelled" },
				abortController.signal
			)
				.then(() => {
					window.location.reload();
				})
				.catch();
		}
	}
	console.log(reservations);
	useEffect(() => {
		return () => {
			if (controllerRef.current) {
				controllerRef.current.abort();
			}
		};
	}, []);

	return (
		<div>
			<h4 className='h3 text-center'>Search Reservations</h4>

			<SearchForm
				phoneNumber={phoneNumber}
				changeHandler={changeHandler}
				submitHandler={submitHandler}
			/>

			{reservations.length ? (
				<div className='py-2'>
					{reservations.map((reservation) => (
						<ReservationView
							key={reservation.reservation_id}
							reservation={reservation}
							cancelHandler={cancelReservationHandler}
						/>
					))}
				</div>
			) : (
				<Empty message='No reservations found' />
			)}
		</div>
	);
}

export default Search;
