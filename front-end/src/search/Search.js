import React, { useState } from "react";
import { searchReservationsByPhone } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import SearchForm from "./SearchForm";
import ReservationList from "../reservations/ReservationsList";

function Search() {
    const [phoneNumber, setPhoneNumer] = useState("");
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);

    const changeHandler = (e) => {
        setPhoneNumer(e.target.value);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setError(null);
        searchReservationsByPhone({ mobile_number: phoneNumber })
            .then((data) => {
                setReservations(data);
                if(!data.length) {
                    setError({ message: "No reservations found"})
                }
            })
            .catch(setError)    
    };
    
    const list = reservations.map((reservation) => 
        <ReservationList key={reservation.reservation_id} reservation={reservation} />
    );

    return (
        <div>
            <h2>Search Page by phone number</h2>
            <ErrorAlert error={error} />
            <SearchForm phoneNumber={phoneNumber}
                changeHandler={changeHandler}
                submitHandler={submitHandler}
            />
            {list}
        </div>
    )
};

export default Search;

