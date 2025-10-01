import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorAlert } from "../components";
import { Loading } from "../components/ui";
import { useSeatTable, useTables } from "../hooks/useTables";
import { routes } from "../utils/routes";

const initialFormState = {
	table_id: "",
};

/**
 * Route `/reservations/:reservation_id/seat`
 */
export default function SetReservationSeat() {
	const navigate = useNavigate();
	const { reservation_id } = useParams();
	const seatTableMutation = useSeatTable();

	const [formData, setFormData] = useState({ ...initialFormState });
	const [error, setError] = useState(null);

	// Fetch tables using React Query
	const { data: tables = [], isLoading, error: tablesError } = useTables();

	const changeHandler = ({ target: { name, value } }) => {
		setFormData((preValue) => ({
			...preValue,
			[name]: value,
		}));
	};

	const submitHandler = (e) => {
		e.preventDefault();
		setError(null);

		seatTableMutation.mutate(
			{
				tableId: formData.table_id,
				data: { reservation_id },
			},
			{
				onSuccess: () => {
					navigate(routes.dashboard);
				},
				onError: (error) => {
					setError(error);
				},
			}
		);
	};

	const tableOptions = tables.map((table) => {
		const label = `${table.table_name} - ${table.capacity}`;
		return (
			<option key={table.table_id} value={table.table_id}>
				{label}
			</option>
		);
	});

	return (
		<div>
			<h4>Seating for reservation: {reservation_id}</h4>
			<ErrorAlert error={error || tablesError} />

			{isLoading ? (
				<Loading />
			) : (
				<form onSubmit={submitHandler}>
					<label htmlFor='table_id'>
						<span>Choose a Table: </span>
						<select
							id='table_id'
							name='table_id'
							onChange={changeHandler}
							value={formData.table_id}
							className='custom-select mb-2'
						>
							<option value=''>-- Select a table --</option>
							{tableOptions}
						</select>
					</label>
					<br />
					<div className='btn-group'>
						<button
							className='btn btn-dark'
							onClick={() => navigate(routes.dashboard)}
						>
							Cancel
						</button>
						<button
							className='btn btn-dark border-left'
							type='submit'
							disabled={seatTableMutation.isPending}
						>
							{seatTableMutation.isPending ? "Seating..." : "Submit"}
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
