import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { listReservations, listTable, unSeatingTable } from "../utils/api";
import { previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import TableList from "../tables/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ todayDate }) {
  const history = useLocation();

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesErrors] = useState(null);
  const [date, setDate] = useState(() => {
    if(history.search) {
      return history.search.slice(6,16);
    }
    return todayDate;
  });
  
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesErrors(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTable(abortController.signal)
      .then(setTables)
      .catch(setTablesErrors)
    return () => {
      abortController.abort();
    }
  };

  const previousButtonHandler = () => {
    setDate(previous(date.toString()));
  };

  const todayButtonHandler = () => {
    setDate(todayDate);
  };

  const nextButtonHandler = () => {
    setDate(next(date.toString()));
  };
  
  function finishButtonHandler(table_id) {
    if(window.confirm("Is this table ready to seat new guests?\nThis cannot be undone.")) {
      setTablesErrors(null);
      unSeatingTable(table_id)
        .then(() => loadDashboard())
        .catch(setTablesErrors)
    };
  };

  return (
    <main>
      <div role="group" className="d-flex py-2 btn-group">
        <button className="btn btn-outline-light" onClick={previousButtonHandler}>
          Previous day
        </button>
        <button className="btn btn-outline-light" onClick={todayButtonHandler}>
          Today
        </button>
        <button className="mr-2 btn btn-outline-light" onClick={nextButtonHandler}>
          Next day
        </button>
      </div>
      <div className="d-md-flex mb-3 justify-content-center">
        <h4 className="mb-0 h3">Date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <section className="d-flex flex-row">
        <div alt="reservations" className="mr-2 pt-2 flex-grow-1 bd-highlight">
          { !!reservations.length && 
            <ReservationsList 
              reservations={reservations} 
              setError={setReservationsError}
            />
          }
        </div>
        <div alt="tables" className="pt-2 flex bd-highlight">
          <div className="d-md-flex mb-3 justify-content-center">
            <h4 className="mb-0">Tables</h4>
          </div>
          { !!tables.length && 
            <TableList
              tables={tables}
              unSeatingHandler={finishButtonHandler}
            />
          }
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
