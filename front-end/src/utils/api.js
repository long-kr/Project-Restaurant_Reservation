/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
 import formatReservationDate from "./format-reservation-date";
 import formatReservationTime from "./format-reservation-date";
 
 const API_BASE_URL =
   process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
 
 /**
  * Defines the default headers for these functions to work with `json-server`
  */
 const headers = new Headers();
 headers.append("Content-Type", "application/json");
 
 /**
  * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
  *
  * This function is NOT exported because it is not needed outside of this file.
  *
  * @param url
  *  the url for the requst.
  * @param options
  *  any options for fetch
  * @param onCancel
  *  value to return if fetch call is aborted. Default value is undefined.
  * @returns {Promise<Error|any>}
  *  a promise that resolves to the `json` data or an error.
  *  If the response is not in the 200 - 399 range the promise is rejected.
  */
 async function fetchJson(url, options, onCancel) {
   try {
     const response = await fetch(url, options);
 
     if (response.status === 204) {
       return null;
     }
 
     const payload = await response.json();
 
     if (payload.error) {
       return Promise.reject({ message: payload.error });
     }
     return payload.data;
   } catch (error) {
     if (error.name !== "AbortError") {
       console.error(error.stack);
       throw error;
     }
     return Promise.resolve(onCancel);
   }
 }
 
 /**
  * Retrieves all existing reservation.
  * @returns {Promise<[reservation]>}
  *  a promise that resolves to a possibly empty array of reservation saved in the database.
  */
 
 export async function listReservations(params, signal) {
   const url = new URL(`${API_BASE_URL}/reservations`);
   Object.entries(params).forEach(([key, value]) =>
     url.searchParams.append(key, value.toString())
   );
   return await fetchJson(url, { headers, signal }, [])
     .then(formatReservationDate)
     .then(formatReservationTime);
 }
 
 /**
  * Send a Post request to create a reservation
  * @return {Promise<[new reservation]>}
  *  a promise with new reservation infomation
  */
 
 export async function createReservation(reservation, signal) {
   const url = `${API_BASE_URL}/reservations`;
   const options = {
     method: "POST",
     headers,
     body: JSON.stringify({ data: reservation }),
     signal
   };
 
   return await fetchJson(url, options, {});
 }
 
 /**
  * Send a Post request to create a table
  * @return {Promise<[new table]>}
  *  a promise with new table infomation
  */
 export async function createTable(table, signal) {
   const url = `${API_BASE_URL}/tables`;
   const options = {
     method: "POST",
     headers,
     body: JSON.stringify({ data: table }),
     signal,
   };
 
   return await fetchJson(url, options, {});
 }
 
 
 /**
  * Send a Put request to assign reservation_id to a table.
  * @returns {Promise<[table]>}
  *  a promise with table information.
  */
 export async function seatingTable(table_id, data) {
   const url = `${API_BASE_URL}/tables/${table_id}/seat`;
   const options = {
     method: "PUT",
     headers,
     body: JSON.stringify({ data }),
   };
 
   return await fetchJson(url, options, {});
 };
 
 /**
  * Send a DELETE request to create a table
  * @return nothing
  */
 export async function unSeatingTable(table_id) {
   const url = `${API_BASE_URL}/tables/${table_id}/seat`;
   const options = {
     method: "DELETE",
     headers,
   };
 
   return await fetchJson(url, options, {});
 };
 
 // /**
 //  * Send a Put request to assign new status to a reservation
 //  * @returns {Promise<[reservation]>}
 //  *  a promise with table information.
 //  */
 // export async function setReservationsStatus(reservation_id, data) {
 //   console.log(data)
 //   const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
 //   const options = {
 //     method: "PUT",
 //     headers,
 //     body: JSON.stringify({ data }),
 //   };
 
 //   return await fetchJson(url, options, {});
 // }
 
 /**
  * Retrieves all existing table.
  * @returns {Promise<[table]>}
  *  a promise that resolves to a possibly empty array of table saved in the database.
  */
 export async function listTable(signal) {
   const url = `${API_BASE_URL}/tables`;
   const options = {
     headers,
     signal
   };
 
   return await fetchJson(url, options, {});
 };
 
 // function nextId() {
 //   const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
 //   return uint32.toString(16);
 // }
 
 /**
  * Retrieves all existing table.
  * @returns {Promise<[table]>}
  *  a promise that resolves to a possibly empty array of table saved in the database.
  */
 export async function searchReservationsByPhone(params, signal) {
   const url = new URL(`${API_BASE_URL}/reservations`)
   const options = {
     headers,
     signal
   };
 
   Object.entries(params).forEach(([key, value]) => 
     url.searchParams.append(key, value.toString())
   );
 
   console.log(url);
   return await fetchJson(url, options, {});
 };
 