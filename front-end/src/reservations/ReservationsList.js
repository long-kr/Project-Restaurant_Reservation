import React from "react";

function ReservationList({ reservation }) {

    return (
        <div>
            { reservation.status === "booked" &&
                <a href={`/reservations/${reservation.reservation_id}/seat`}>
                    Seat
                </a>
            }
            <p data-reservation-id-status={reservation.reservation_id}>
                Status: {reservation.status}
            </p>
            <p>First Name: {reservation.first_name}</p>
            <p>Last Name: {reservation.last_name}</p>
            <p>Phone: {reservation.mobile_number}</p>
            <p>Guess Number: {reservation.people}</p>
            <p>Date: {reservation.reservation_date}</p>
            <p>Time: {reservation.reservation_time}</p>
        </div>
    )
}

export default ReservationList;