/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
 import { default as formatReservationDate, default as formatReservationTime } from "./format-reservation-date";
 
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
  * @param {Object} params
  *  an object containing query parameters to filter the reservations.
  * @param {AbortSignal} signal
  * [signal] to abort the request.
  * @returns {Promise<[reservation]>}
  *  a promise that resolves to a possibly empty array of reservation saved in the database.
  */
 export async function listReservations(params, signal) {
   const url = new URL(`${API_BASE_URL}/reservations`);
   Object.entries(params).forEach(([key, value]) =>
     url.searchParams.append(key, value.toString())
   );
   return await fetchJson(url, { headers, [signal] }, [])
     .then(formatReservationDate)
     .then(formatReservationTime);
 }

 /**
  * Retrieves an existing reservation.
  * @param {number|string} reservation_id - The ID of the reservation.
  * @param {AbortSignal} [signal] - Signal to abort the request.
  * @returns {Promise<import('./type').Reservation>} A promise that resolves to the reservation object.
  */
  export async function getReservation(reservation_id, signal) {
    const url = `${API_BASE_URL}/reservations/${reservation_id}`
    const options = {
      headers,
      signal
    };
  
    return await fetchJson(url, options, {})
   };

/**
 * Creates a new reservation.
 * @param {import('./type').Reservation} reservation - The reservation data.
 * @param {AbortSignal} [signal] - Signal to abort the request.
 * @returns {Promise<import('./type').Reservation>} A promise with the new reservation information.
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
 };
 
 /**
 * Updates an existing reservation.
 * @param {number|string} reservation_id - The ID of the reservation.
 * @param {Object} data - The updated reservation data.
 * @param {AbortSignal} [signal] - Signal to abort the request.
 * @returns {Promise<import('./type').Reservation>} A promise with the updated reservation information.
 */
 export async function updateReservation(reservation_id, data, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
    signal
  };
 
  return await fetchJson(url, options, {});
 };

 /**
 * Searches reservations by phone number.
 * @param {Object} params - Query parameters (e.g., mobile_number).
 * @param {AbortSignal} [signal] - Signal to abort the request.
 * @returns {Promise<[import('./type').Reservation]>} A promise that resolves to an array of reservations.
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
  
    return await fetchJson(url, options, {});
  };

 /**
 * Updates the status of a reservation.
 * @param {number|string} reservation_id - The ID of the reservation.
 * @param {Object} data - The status update data.
 * @param {AbortSignal} [signal] - Signal to abort the request.
 * @returns {Promise<import('./type').Reservation>} A promise with the updated reservation information.
 */
  export async function setReservationStatus(reservation_id, data, signal) {
    const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;

    const options = {
      method: "PUT",
      headers,
      body: JSON.stringify({ data }),
      signal
    };

    return await fetchJson(url, options, {});
  }

/**
 * Retrieves all existing tables.
 * @param {AbortSignal} [signal] - Signal to abort the request.
 * @returns {Promise<[import('./type').Table]>} A promise that resolves to an array of tables.
 */
 export async function listTable(signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    headers,
    signal
  };

  return await fetchJson(url, options, {});
};

/**
 * Creates a new table.
 * @param {Object} table - The table data.
 * @param {AbortSignal} [signal] - Signal to abort the request.
 * @returns {Promise<import('./type').Table>} A promise with the new table information.
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
 };
 
 
/**
 * Assigns a reservation to a table (seating).
 * @param {number|string} table_id - The ID of the table.
 * @param {Object} data - The seating data (reservation_id).
 * @param {AbortSignal} [signal] - Signal to abort the request.
 * @returns {Promise<import('./type').Table>} A promise with the updated table information.
 */
 export async function seatingTable(table_id, data, signal) {
   const url = `${API_BASE_URL}/tables/${table_id}/seat`;
   const options = {
     method: "PUT",
     headers,
     body: JSON.stringify({ data }),
     signal
   };
 
   return await fetchJson(url, options, {});
 };
 
 /**
 * Frees a table (unseating).
 * @param {number|string} table_id - The ID of the table.
 * @param {AbortSignal} [signal] - Signal to abort the request.
 * @returns {Promise<void>} A promise that resolves when the table is freed.
 */
 export async function unSeatingTable(table_id, signal) {
   const url = `${API_BASE_URL}/tables/${table_id}/seat`;
   const options = {
     method: "DELETE",
     headers,
     signal
   };
 
   return await fetchJson(url, options, {});
 };
 

/**
 * Deletes a table.
 * @param {number|string} table_id - The ID of the table.
 * @param {AbortSignal} [signal] - Signal to abort the request.
 * @returns {Promise<void>} A promise that resolves when the table is deleted.
 */
export async function deleteTable(table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}`;
  const options = {
    method: "DELETE",
    headers,
    signal
  };

  return await fetchJson(url, options, {});
};


