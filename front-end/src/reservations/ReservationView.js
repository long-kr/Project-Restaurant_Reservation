import React from "react";
import { formatAsDate } from "../utils/date-time";


/**
 * Reservation View for <ReservationList/>
 */
function ReservationView({ reservation, cancelHandler }) {
    
    return (
        <div>
            { reservation.status !== "cancelled" &&
                <div>  
                    { reservation.status === "booked" &&
                        <a href={`/reservations/${reservation.reservation_id}/seat`}>
                            Seat
                        </a>
                    }
                    <p data-reservation-id-status={`${reservation.reservation_id}`}>
                        Status: {reservation.status}
                    </p> 
                    <p>Reservation id: {reservation.reservation_id}</p>
                    <p>Customer Fist Name: {reservation.first_name}</p>
                    <p>Customer Last Name: {reservation.last_name}</p>
                    <p>Phone Number: {reservation.mobile_number}</p>
                    <p>Guess Number: {reservation.people}</p>
                    <p>Date Reservation: {formatAsDate(reservation.reservation_date)}</p>
                    <p>Time Reservation: {reservation.reservation_time}</p>
                    <a href={`/reservations/${reservation.reservation_id}/edit`}>
                        Edit
                    </a>
                    <button 
                        data-reservation-id-cancel={reservation.reservation_id}
                        onClick={() => cancelHandler(reservation.reservation_id)}
                    >
                        Cancel
                    </button>
                </div>
            }
        </div>
    )
};

export default ReservationView;