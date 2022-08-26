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
        const closedDatesCheck 
            = timeHandler(reservation.reservation_date, reservation.reservation_time);
        if (!closedDatesCheck) {
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

    const timeHandler = (dateInput, timeInput) => {
        const minDate =  today();
        const weekDay = getWeekDay(dateInput);
        // Convert time into value
        const openTime = new Date().setHours(10,30,0);
        const closedTime = new Date().setHours(21,30,0);
        const hourInput = Number(timeInput.split(":")[0]);
        const minusInput = Number(timeInput.split(":")[1]);
        const reserveTime = new Date().setHours(hourInput, minusInput, 0);
        const timeNow = new Date().getTime()
        const errors = [];

        if (dateInput < minDate) {
            errors.push({
                message: `reservation_date cannot be a past day.`
            }) 
        }
    
        if (weekDay === 2) {
            errors.push({
                message: `reservation_date cannot be Tuesday.`
            }) 
        }

        if (reserveTime < openTime || reserveTime > closedTime) {
            errors.push({
                message: `Reservation time is between 10h30 a.m and 9h30 p.m`
            })
        }

        if ( dateInput === minDate && timeNow > reserveTime ) {
            errors.push({
                message: `It's passed reservation time!`
            })
        }
    
        if(errors.length) {
            setError(errors);
            return errors;
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