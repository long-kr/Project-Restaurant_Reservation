import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import SubmitNewTable from "./SubmitNewTable";


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
            <h2> Create new table</h2>
            <ErrorAlert error={error} />
            <SubmitNewTable 
                table={table} 
                submitHandler={submitHandler} 
                changeHandler={changeHandler} 
            />
        </div>
    )
}

export default TableCreate;