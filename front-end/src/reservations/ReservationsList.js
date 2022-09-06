import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { setReservationStatus } from "../utils/api";

/**
 * List Reservations for Dashboard and Search
 */
function ReservationList({ reservation }) {
    const [error, setError] = useState(null)

    const cancelHandler = (e) => {
        e.preventDefault();
        if(window.confirm("Do you want to cancel this reservation?\nThis cannot be undone.")) {
            setError(null);
            setReservationStatus(reservation.reservation_id, { status: "cancelled" })
            .then(() => window.location.reload(false))
            .catch(setError)
          };
        
    };

    return (
        <div>
             { reservation.status !== "cancelled" &&
                <div> 
                    <ErrorAlert error={error} />
                    { reservation.status === "booked" &&
                        <a href={`/reservations/${reservation.reservation_id}/seat`}>
                            Seat
                        </a>
                    }
                    <p data-reservation-id-status={`${reservation.reservation_id}`}>
                        Status: {reservation.status}
                    </p> 
                    <p>Reservation id: {reservation.reservation_id}</p>
                    <p>First Name: {reservation.first_name}</p>
                    <p>Last Name: {reservation.last_name}</p>
                    <p>Phone: {reservation.mobile_number}</p>
                    <p>Guess Number: {reservation.people}</p>
                    <p>Date: {reservation.reservation_date}</p>
                    <p>Time: {reservation.reservation_time}</p>
                    <a href={`/reservations/${reservation.reservation_id}/edit`}>
                        Edit
                    </a>
                    <button data-reservation-id-cancel={reservation.reservation_id}
                        onClick={cancelHandler}
                    >
                        Cancel
                    </button>
                
                </div>
            }
        </div>
       
    )
}

export default ReservationList;