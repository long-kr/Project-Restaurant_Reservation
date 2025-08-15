import { useState } from "react";
import { redirect } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import SubmitForm from "./SubmitForm";

function TableCreate() {
	const initialTable = {
		table_name: "",
		capacity: "",
	};

	const [table, setTable] = useState(initialTable);
	const [error, setError] = useState(null);

	const submitHandler = (e) => {
		e.preventDefault();
		const abortController = new AbortController();
		setError(null);
		table.capacity = parseInt(table.capacity);
		createTable(table, abortController.signal)
			.then(() => {
				// TODO: check logic
				redirect("/dashboard");
			})
			.catch(setError);
		return () => abortController.abort();
	};

	const changeHandler = ({ target: { name, value } }) => {
		setTable((previousTable) => ({
			...previousTable,
			[name]: value,
		}));
	};

	return (
		<div>
			<h4 className='h3 text-center'>Create New Table</h4>
			<ErrorAlert error={error} />
			<SubmitForm
				table={table}
				submitHandler={submitHandler}
				changeHandler={changeHandler}
			/>
		</div>
	);
}

export default TableCreate;
