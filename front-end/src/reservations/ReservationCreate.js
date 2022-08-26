import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import { today } from "../utils/date-time";
import SubmitForm from "./SubmitForm";
import ErrorAlert from "../layout/ErrorAlert";



function ReservationCreate() {
    const initialReservation = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        people: "",
        reservation_date: "",
        reservation_time: ""
    }
    
    const history = useHistory();
    const [reservation, setReservation] = useState({...initialReservation});
    const [error, setError] = useState([]);

    const submitHandler = (e) => {
        e.preventDefault();
        reservation.people = parseInt(reservation.people);
        const closedDatesCheck = closedDateHandler(reservation.reservation_date);
        if (!closedDatesCheck) {
            console.log("28");
            createReservation(reservation)
                .then(() => {
                    history.push(`/dashboard?date=${reservation.reservation_date}`);
                    console.log("submitted new reservation", reservation)
                })
                .catch((errors) => setError([errors])) 
        }    
    }

    const changeHandler = ({ target }) => {
        setReservation((preInfo) => ({
            ...preInfo,
            [target.name]: target.value,  
        }));
    }

    const closedDateHandler = (input) => {
        const minDate =  today();
        const weekDay = getWeekDay(input);
        const data = [];
    
        if (input < minDate) {
            const past = {
                message: `reservation_date cannot be a past day.`
            };
            data.push(past) 
        }
    
        if (weekDay === 2) {
            const tues = {
                message: `reservation_date cannot be Tuesday.`
            };
            data.push(tues) 
        }
    
        if(data.length) {
            setError(data);
            return data;
        }
    }

    return (
        <div>
            <p>Create new reservation</p>
            {error && error.map((err, i) => (<ErrorAlert key={i} error={err} />))}
            <SubmitForm 
                reservation={reservation} 
                submitHandler={submitHandler}
                changeHandler={changeHandler}
            />
        </div>
    );
}

function getWeekDay(input) {
    const dateArray = input.split("-");
    const year = dateArray[0];
    const month = parseInt(dateArray[1], 10) - 1;
    const date = dateArray[2];
    const newDate = new Date(year, month, date);

    return newDate.getDay();
}

export default ReservationCreate;