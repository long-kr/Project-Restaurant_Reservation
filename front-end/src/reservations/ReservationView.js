import React from "react";
import { formatAsDate } from "../utils/date-time";

/**
 * Reservation View for <ReservationList/>
 */
function ReservationView({ reservation, cancelHandler }) {

    return (
        <div className="mb-1 pb-1 border-bottom">
            <div>  
                { reservation.status === "booked" &&
                    <a href={`/reservations/${reservation.reservation_id}/seat`}
                        className="mb-2 px-3 btn btn-outline-light"
                    >
                        Seat
                    </a>
                }
                <p data-reservation-id-status={`${reservation.reservation_id}`}>
                    Status: {reservation.status}
                </p> 
                <p>Reservation ID: {reservation.reservation_id}</p>
                <p>Fist Name: {reservation.first_name}</p>
                <p>Last Name: {reservation.last_name}</p>
                <p>Phone Number: {reservation.mobile_number}</p>
                <p>Guess Number: {reservation.people}</p>
                <p>Date Reservation: {formatAsDate(reservation.reservation_date)}</p>
                <p>Time Reservation: {reservation.reservation_time}</p>
                <a  className="px-3 mr-3 mb-2 btn btn-outline-light"
                    href={`/reservations/${reservation.reservation_id}/edit`}
                >
                    Edit
                </a>
                <button data-reservation-id-cancel={reservation.reservation_id}
                    className="mb-2 btn btn-outline-light"                    
                    onClick={() => cancelHandler(reservation.reservation_id)}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
};

export default ReservationView;