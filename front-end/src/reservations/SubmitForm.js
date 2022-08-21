import React from "react";
import { today } from "../utils/date-time";
import { useHistory } from "react-router-dom";

export default function SubmitForm({submitHandler, changeHandler, reservation}) {
    const  history = useHistory();

    
    return (
        <div>
             <form onSubmit={submitHandler}>
                <label htmlFor="first_name">
                    First Name:
                    <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        onChange={changeHandler}
                        value={reservation.first_name}
                        placeholder="Your first name"
                        required
                    />
                </label>
                <br />
                <label htmlFor="last_name">
                    Last Name:
                    <input
                        id="last_name"
                        type="text"
                        name="last_name"
                        onChange={changeHandler}
                        value={reservation.last_name}
                        placeholder="Your last name"
                        required
                    />
                </label>
                <br />
                <label htmlFor="mobile_number">
                    Mobile Number:
                    <input
                        id="mobile_number"
                        type="tel"
                        name="mobile_number"
                        onChange={changeHandler}
                        value={reservation.mobile_number}
                        placeholder="xxx-xxx-xxxx"
                        required
                    />
                </label>
                <br />
                <label htmlFor="people">
                    People:
                    <input
                        id="people"
                        type="number"
                        name="people"
                        onChange={changeHandler}
                        value={reservation.people}
                        placeholder="how many guess?"
                        required
                    />
                </label>
                <br />
                <label htmlFor="reservation_date">
                    Date to reserve:
                    <input id="reservation_date" 
                        type="date"
                        name="reservation_date"
                        onChange={changeHandler}
                        value={reservation.reservation_date}
                        min={today()}
                        required
                    />
                </label>
                <br />
                <label htmlFor="reservation_time">
                    Time to reserve:
                    <input id="reservation_time" 
                        type="time"     
                        name="reservation_time"
                        min="09:00" 
                        max="22:00" 
                        onChange={changeHandler}
                        value={reservation.reservation_time}
                        required
                    />
                </label>
                <br />
                <button onClick={() => history.goBack()}>Cancel</button>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
