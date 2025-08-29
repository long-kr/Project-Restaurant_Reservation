import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTable, seatingTable } from "../utils/api";
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

	const [formData, setFormData] = useState({ ...initialFormState });
	const [tables, setTables] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();
		setError(null);
		listTable(abortController.signal).then(setTables).catch(setError);
	}, []);

	const changeHandler = ({ target: { name, value } }) => {
		setFormData((preValue) => ({
			...preValue,
			[name]: value,
		}));
	};

	const submitHandler = (e) => {
		e.preventDefault();
		setError(null);
		seatingTable(formData.table_id, { reservation_id })
			.then(() => {
				navigate(routes.dashboard);
			})
			.catch(setError);
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
			<ErrorAlert error={error} />
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
					<button className='btn btn-dark border-left' type='submit'>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}
