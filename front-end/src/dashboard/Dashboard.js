import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { listReservations } from "../utils/api";
import { previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "../reservations/Reservations";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ todayDate }) {
  const history = useLocation();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [date, setDate] = useState(() => {

    if(history.search) {
      return history.search.slice(6,16);
    }
    
    return todayDate;
  })
  
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const previousButtonHandler = () => {
    setDate(previous(date.toString()));
  }

  const todayButtonHandler = () => {
    setDate(todayDate);
  }

  const nextButtonHandler = () => {
    setDate(next(date.toString()));
  }

  const list = reservations.map((reservation) => (
    <Reservations key={reservation.reservation_id} reservation={reservation} />
  ))
  
  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={previousButtonHandler}>Previous</button>
      <button onClick={todayButtonHandler}>Today</button>
      <button onClick={nextButtonHandler}>Next</button>
      <button onClick={nextButtonHandler}>Select</button>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <section>{list}</section> 
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
