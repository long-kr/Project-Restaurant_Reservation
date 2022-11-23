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
  * Retrieves an existing reservation.
  * @returns {Promise<[reservation]>}
  *  a promise that resolves to a possibly empty array of reservation saved in the database.
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
 };
 
 /**
  * Send a Put request to update a reservation
  * @return {Promise<[new reservation]>}
  *  a promise with new reservation infomation
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
  
    return await fetchJson(url, options, {});
  };

 /**
  * Retrieves all existing table.
  * @returns {Promise<[table]>}
  *  a promise that resolves to a possibly empty array of table saved in the database.
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
 };
 
 
 /**
  * Send a Put request to assign reservation_id to a table.
  * @returns {Promise<[table]>}
  *  a promise with table information.
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
  * Send a DELETE request to free a table
  * @return nothing
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
  * Send a DELETE request to free a table
  * @return nothing
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
  
 
 