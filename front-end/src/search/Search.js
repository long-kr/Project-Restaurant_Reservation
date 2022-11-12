import React, { useState } from "react";
import { searchReservationsByPhone } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import SearchForm from "./SearchForm";
import ReservationList from "../reservations/ReservationsList";

/**
 * Defines the Search Page
 * @input phone number
 *  return reservations user wants to find
 */
function Search() {
  const [phoneNumber, setPhoneNumer] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const changeHandler = (e) => {
    setPhoneNumer(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    setError(null);
    searchReservationsByPhone({ mobile_number: phoneNumber }, abortController.signal)
      .then((data) => {
        setReservations(data);
        if (!data.length) {
          setError({ message: "No reservations found" });
        }
      })
      .catch(setError);
    return () => abortController.abort();
  };

  return (
    <div>
      <h4 className="h3 text-center">Search Reservations</h4>
      <ErrorAlert error={error} />
      <SearchForm
        phoneNumber={phoneNumber}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
      />
      <ReservationList reservations={reservations} setError={setError} />
    </div>
  );
}

export default Search;
