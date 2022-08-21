import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import SubmitForm from "./SubmitForm";
import ErrorAlert from "../layout/ErrorAlert";


function ReservationCreate() {
    const initialReservation = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: ""
    }
    
    const history = useHistory();
    const [reservation, setReservation] = useState({...initialReservation});
    const [error, setError] = useState(null);


    const submitHandler = (e) => {
        e.preventDefault();
        createReservation(reservation)
            .then(() => {
                history.push("/dashboard");
                console.log("submitted new reservation", reservation)
            })
            .catch(setError) 
    }

    const changeHandler = ({ target }) => {
        setReservation((preInfo) => ({
            ...preInfo,
            [target.name]: target.value
        }));
    }

    return (
        <div>
            <p>Create new reservation</p>
            <ErrorAlert error={error} />
            <SubmitForm 
                reservation={reservation} 
                submitHandler={submitHandler}
                changeHandler={changeHandler}
            />
        </div>
    );
}

export default ReservationCreate;