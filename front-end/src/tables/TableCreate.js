import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../components/layout";
import { useCreateTable } from "../hooks/useTables";
import SubmitForm from "./SubmitForm";

const initialTable = {
	table_name: "",
	capacity: "",
};

function TableCreate() {
	const navigate = useNavigate();
	const createTableMutation = useCreateTable();

	const [table, setTable] = useState(initialTable);
	const [error, setError] = useState(null);

	const submitHandler = (e) => {
		e.preventDefault();
		setError(null);
		table.capacity = parseInt(table.capacity);

		createTableMutation.mutate(
			{ table },
			{
				onSuccess: () => {
					navigate("/dashboard");
				},
				onError: (error) => {
					setError(error);
				},
			}
		);
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
