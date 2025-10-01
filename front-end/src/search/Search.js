import { useState } from "react";
import { toast } from "sonner";
import { Empty, Loading } from "../components/ui";
import {
	useReservationsByPhone,
	useUpdateReservationStatus,
} from "../hooks/useReservations";
import ReservationView from "../reservations/ReservationView";
import SearchForm from "./SearchForm";

/**
 * Defines the Search Page
 * @input phone number
 * @returns {JSX.Element}
 */
function Search() {
	const [phoneNumber, setPhoneNumer] = useState("");
	const [searchTriggered, setSearchTriggered] = useState(false);

	const updateReservationStatusMutation = useUpdateReservationStatus();

	// Only fetch when search is triggered and phone number is provided
	const {
		data: reservations = [],
		isLoading,
		error,
	} = useReservationsByPhone(searchTriggered ? phoneNumber : "");

	const changeHandler = (e) => {
		setPhoneNumer(e.target.value);
		setSearchTriggered(false); // Reset search trigger when phone number changes
	};

	const submitHandler = (e) => {
		e.preventDefault();
		if (phoneNumber.trim()) {
			setSearchTriggered(true);
		}
	};

	function cancelReservationHandler(reservation_id) {
		if (
			window.confirm(
				"Do you want to cancel this reservation?\nThis cannot be undone."
			)
		) {
			updateReservationStatusMutation.mutate({
				reservationId: reservation_id,
				data: { status: "cancelled" },
			});
		}
	}

	// Show error toast when search fails
	if (error && searchTriggered) {
		toast.error("No reservations found for this phone number.");
	}

	return (
		<div>
			<h4 className='h3 text-center'>Search Reservations</h4>

			<SearchForm
				phoneNumber={phoneNumber}
				changeHandler={changeHandler}
				submitHandler={submitHandler}
			/>

			{isLoading ? (
				<Loading />
			) : searchTriggered && reservations.length ? (
				<div className='py-2'>
					{reservations.map((reservation) => (
						<ReservationView
							key={reservation.reservation_id}
							reservation={reservation}
							cancelHandler={cancelReservationHandler}
						/>
					))}
				</div>
			) : searchTriggered ? (
				<Empty message='No reservations found' />
			) : null}
		</div>
	);
}

export default Search;
