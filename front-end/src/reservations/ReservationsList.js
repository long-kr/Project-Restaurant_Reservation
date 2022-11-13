import React from "react";
import ReservationView from "./ReservationView";
import { setReservationStatus } from "../utils/api";

/**
 * List Reservations for Dashboard and Search
 */
function ReservationList({ reservations, setError }) {

    function cancelHandler(reservation_id) {
        if(window.confirm("Do you want to cancel this reservation?\nThis cannot be undone.")) {
            setError(null);
            const abortController = new AbortController();
            setReservationStatus(reservation_id, { status: "cancelled" }, abortController.signal)
                .then(() => window.location.reload(false))
                .catch(setError)
            return () => abortController.abort();
        };
    };

    const list = reservations.map((reservation, i) =>   
        <ReservationView 
            key={reservation.reservation_id}
            reservation={reservation}
            cancelHandler={cancelHandler}
        />
    );
    
    return  (
        <div>
            {list}
        </div>
    )
};

export default ReservationList;