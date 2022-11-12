import React from "react";
import { formatAsDate } from "../utils/date-time";

/**
 * Reservation View for <ReservationList/>
 */
function ReservationView({ reservation, cancelHandler }) {

    return (
        <div className="my-2 mx-0">
            <div className="card bg-dark">
                <div className="card-header d-flex justify-content-between">
                    <p>Reservation ID: {reservation.reservation_id}</p>
                    { reservation.status === "booked" &&
                        <div>
                            <a href={`/reservations/${reservation.reservation_id}/seat`}
                                className="mb-2 px-3 btn btn-light"
                            >
                            &nbsp;&nbsp;Seat&nbsp;&nbsp;
                            </a>
                        </div>
                     }
                </div>
            </div>
            
            <div className="card-body light-background">
                <p data-reservation-id-status={`${reservation.reservation_id}`}>
                    Status: {reservation.status}
                </p> 
                <p>Name: {reservation.first_name} {reservation.last_name}</p>
                <p>Phone Number: {reservation.mobile_number}</p>
                <p>Guess Number: {reservation.people}</p>
                <p>Date Reservation: {formatAsDate(reservation.reservation_date)}</p>
                <p>Time Reservation: {reservation.reservation_time}</p>
            </div>

            <div className="card-footer bg-dark"> 
                <div  className="btn-group">
                    <a  className="btn btn-light"
                            href={`/reservations/${reservation.reservation_id}/edit`}
                        >
                            &nbsp;&nbsp;Edit&nbsp;&nbsp;
                        </a>
                        <button data-reservation-id-cancel={reservation.reservation_id}
                            className="btn btn-light"                    
                            onClick={() => cancelHandler(reservation.reservation_id)}
                        >
                            Cancel
                    </button>
                </div>
            </div>
        </div>
    )
};

export default ReservationView;