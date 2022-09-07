import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import SubmitForm from "./SubmitForm";


function TableCreate() {
    const history = useHistory();
    const initialTable = {
        table_name: "",
        capacity: "",
    };

    const [table, setTable] = useState(initialTable);
    const [error, setError] = useState(null);

    const submitHandler = (e) => {
        e.preventDefault();
        setError(null);
        table.capacity = parseInt(table.capacity);
        createTable(table)
            .then(() => {
                history.push("/dashboard");
            })
            .catch(setError);
    };

    const changeHandler = ({ target: { name, value }}) => {
        setTable((previousTable) => ({
            ...previousTable,
            [name]: value,
        }));
    };

    return (
        <div>
            <h1>Reservations</h1>
            <h4>Create new table</h4>
            <ErrorAlert error={error} />
            <SubmitForm 
                table={table} 
                submitHandler={submitHandler} 
                changeHandler={changeHandler} 
            />
        </div>
    )
};

export default TableCreate;