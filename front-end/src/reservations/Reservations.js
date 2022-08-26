import React from "react";;

function Reservations({ reservation }) {

    return (
        <div>
            <p>First Name: {reservation.first_name}</p>
            <p>Last Name: {reservation.last_name}</p>
            <p>Phone: {reservation.mobile_number}</p>
            <p>Guess Number: {reservation.people}</p>
            <p>Date: {reservation.reservation_date}</p>
            <p>Time: {reservation.reservation_time}</p>
        </div>
    )
}

export default Reservations;