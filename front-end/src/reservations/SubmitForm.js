import React from "react";
import { useHistory } from "react-router-dom";

export default function SubmitForm({submitHandler, changeHandler, reservation}) {
    const  history = useHistory();
    
    return (
        <div>
             <form onSubmit={submitHandler}>
                <div className="form-row">
                    <label className="col-md-5 mb-3" htmlFor="first_name">
                        <span>First Name:</span>
                        <input
                            id="first_name"
                            type="text"
                            name="first_name"
                            onChange={changeHandler}
                            value={reservation.first_name}
                            placeholder="cusomter first name"
                            required
                            className="form-control"
                        />
                    </label>
                    <label className="col-md-5 mb-3" htmlFor="last_name">
                        <span>Last Name:</span>
                        <input
                            id="last_name"
                            type="text"
                            name="last_name"
                            onChange={changeHandler}
                            value={reservation.last_name}
                            placeholder="customer last name"
                            required
                            className="form-control"
                        />
                    </label>
                </div>
                <br />
                <div className="form-row">
                    <label className="col-md-5 mb-3" htmlFor="mobile_number">
                        <span>Mobile Number:</span>
                        <input
                            id="mobile_number"
                            type="tel"
                            name="mobile_number"
                            onChange={changeHandler}
                            value={reservation.mobile_number}
                            placeholder="xxx-xxx-xxxx"
                            required
                            className="form-control"
                        />
                    </label>
                    <br />
                    <label className="col-md-5 mb-3" htmlFor="people">
                        <span>Number of Guest:</span>                    
                        <input
                            id="people"
                            type="number"
                            name="people"
                            onChange={changeHandler}
                            value={reservation.people}
                            placeholder="how many guess?"
                            min="1"
                            required
                            className="form-control"
                        />
                    </label>
                </div>
                <br />
                <div className="form-row">
                <label className="col-md-5 mb-3" htmlFor="reservation_date">
                    <span>Date to reserve:</span>
                    <input id="reservation_date" 
                        type="date"
                        name="reservation_date"
                        onChange={changeHandler}
                        value={reservation.reservation_date}
                        placeholder="YYYY-MM-DD"
                        required
                        className="form-control"
                    />
                </label>
                <br />
                <label className="col-md-5 mb-3" htmlFor="reservation_time">
                    <span>Time to reserve:</span>                    
                    <input id="reservation_time" 
                        type="time"     
                        name="reservation_time"
                        onChange={changeHandler}
                        value={reservation.reservation_time}
                        placeholder="HH:MM"
                        required
                        className="form-control"
                    />
                </label>
                </div>
                <br />
                <button className="my-2 btn btn-outline-light btn-lg" 
                    onClick={() => history.goBack()}
                >
                    Cancel
                </button>
                <button className="my-2 ml-3 btn btn-outline-light btn-lg" type="submit">
                    Submit
                </button>
            </form>
        </div>
    )
}
