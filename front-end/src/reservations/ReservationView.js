import React from "react";
import { formatAsDate } from "../utils/date-time";

/**
 * Reservation View for <ReservationList/>
 */
function ReservationView({ reservation, cancelHandler }) {

    return (
        <div className="my-2 mx-0">
            <div className="card bg-dark">
                <div className="card-header">
                    <p className="m-0">Guest: {reservation.first_name} {reservation.last_name}</p>
                </div>
            </div>
            
            <div className="card-body light-background">
                <p data-reservation-id-status={`${reservation.reservation_id}`}>
                    Status: {reservation.status}
                </p>
                <p>Reservation ID: {reservation.reservation_id}</p> 
                
                <p>Mobile: {reservation.mobile_number}</p>
                <p>Guest Number: {reservation.people}</p>
                <p>Date: {formatAsDate(reservation.reservation_date)}</p>
                <p>Time: {reservation.reservation_time}</p>
            </div>

            <div className="card-footer bg-dark"> 
                <div className="d-flex justify-content-around">
                    <a  className="btn border-right"
                        href={`/reservations/${reservation.reservation_id}/edit`}
                    >
                        &nbsp;&nbsp; Edit &nbsp;&nbsp;
                    </a>
                    <button data-reservation-id-cancel={reservation.reservation_id}
                        className="btn"                    
                        onClick={() => cancelHandler(reservation.reservation_id)}
                    >
                        Cancel
                    </button>
                    { reservation.status === "booked" &&
                        <a href={`/reservations/${reservation.reservation_id}/seat`}
                            className="btn border-left"
                        >
                            &nbsp;&nbsp; Seat &nbsp;&nbsp;
                        </a>
                    }
                </div>
            </div>
        </div>
    )
};

export default ReservationView;