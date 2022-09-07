import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { listTable, seatingTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Route `/reservations/:reservation_id/seat`
 */
export default function SetReservationSeat() {
    const initialFormState = {
        table_id: ""
    };

    const history = useHistory();
    const { reservation_id } = useParams();

    const [formData, setFormData] = useState({...initialFormState});
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        setError(null);
        listTable(abortController.signal)
            .then(setTables)
            .catch(setError)
    }, [])

    const changeHandler = ({ target: { name, value }}) => {
        setFormData((preValue) => ({
            ...preValue,
            [name]: value
        }))
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setError(null);
        seatingTable(formData.table_id, { reservation_id })
            .then((data) => {
                console.log(data);
                history.push("/dashboard")
            })
            .catch(setError);
    };

    const tableOptions = tables.map((table) => (
        <option key={table.table_id} value={table.table_id}>
            {table.table_name} - {table.capacity}
        </option>
    ));

    return (
        <div>
            <h4>Seating for reservation: {reservation_id}</h4>
            <ErrorAlert error={error} />
            <form onSubmit={submitHandler}>
                <label htmlFor="table_id">
                    Choose a Table
                    <select
                        id="table_id"
                        name="table_id"
                        onChange={changeHandler}
                        value={formData.table_id}
                    >
                        <option value="">-- Select a table --</option>
                        {tableOptions}
                    </select>
                </label>
                <br />
                <button onClick={() => history.goBack()}>Cancel</button>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
       
}

