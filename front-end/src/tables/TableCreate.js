import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormActions, Input } from "../components";
import { ErrorAlert } from "../components/layout";
import { useCreateTable } from "../hooks/useTables";

const initialTable = {
	table_name: "",
	capacity: "",
};

function TableCreate() {
	const navigate = useNavigate();
	const createTableMutation = useCreateTable();

	const [table, setTable] = useState({ ...initialTable });
	const [error, setError] = useState(null);

	const submitHandler = (e) => {
		e.preventDefault();
		table.capacity = parseInt(table.capacity);

		createTableMutation.mutate(
			{ table },
			{
				onSuccess: () => {
					navigate("/dashboard");
				},
				onError: (errors) => {
					setError([errors]);
				},
			}
		);
	};

	const changeHandler = ({ target }) => {
		setTable((prevTable) => ({
			...prevTable,
			[target.name]: target.value,
		}));
	};

	return (
		<div>
			<h4 className='h3 text-center mb-0'>Create New Table</h4>

			{error && error.map((err, i) => <ErrorAlert key={i} error={err} />)}

			<Form onSubmit={submitHandler}>
				<Input
					type='text'
					name='table_name'
					label='Table Name'
					placeholder="Table's name"
					value={table.table_name}
					onChange={changeHandler}
					minLength={2}
					required
					helpText='Minimum 2 characters'
					className='col-md-5 mb-3 pl-0'
				/>

				<hr />

				<Input
					type='number'
					name='capacity'
					label='Capacity'
					placeholder='Number of people'
					value={table.capacity}
					onChange={changeHandler}
					min={1}
					required
					helpText='Minimum 1 person'
					className='col-md-5 mb-3 pl-0'
				/>

				<FormActions>
					<Button variant='dark' onClick={() => navigate(-1)} type='button'>
						Cancel
					</Button>
					<Button
						variant='dark'
						type='submit'
						className='border-left'
						loading={createTableMutation.isPending}
					>
						Submit
					</Button>
				</FormActions>
			</Form>
		</div>
	);
}

export default TableCreate;
