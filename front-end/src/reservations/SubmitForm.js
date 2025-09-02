import { useNavigate } from "react-router-dom";
import { routes } from "../utils/routes";

//TODO: create input component

export default function SubmitForm({
	submitHandler,
	changeHandler,
	reservation,
}) {
	const navigate = useNavigate();
	return (
		<form onSubmit={submitHandler}>
			<div className='form-row'>
				<label className='col-md-5 mb-3' htmlFor='first_name'>
					<p>First Name:</p>
					<input
						id='first_name'
						type='text'
						name='first_name'
						onChange={changeHandler}
						value={reservation.first_name}
						placeholder='customer first name'
						required
						className='form-control'
					/>
				</label>
				<label className='col-md-5 mb-3' htmlFor='last_name'>
					<p>Last Name:</p>
					<input
						id='last_name'
						type='text'
						name='last_name'
						onChange={changeHandler}
						value={reservation.last_name}
						placeholder='customer last name'
						required
						className='form-control'
					/>
				</label>
			</div>
			<br />
			<div className='form-row'>
				<label className='col-md-5 mb-3' htmlFor='mobile_number'>
					<p>Mobile Number:</p>
					<input
						id='mobile_number'
						type='tel'
						name='mobile_number'
						onChange={changeHandler}
						value={reservation.mobile_number}
						placeholder='xxx-xxx-xxxx'
						required
						className='form-control'
					/>
				</label>
				<br />
				<label className='col-md-5 mb-3' htmlFor='people'>
					<p>Number of Guest:</p>
					<input
						id='people'
						type='number'
						name='people'
						onChange={changeHandler}
						value={reservation.people}
						placeholder='how many guest?'
						min='1'
						required
						className='form-control'
					/>
				</label>
			</div>
			<br />
			<div className='form-row'>
				<label className='col-md-5 mb-3' htmlFor='reservation_date'>
					<p>Date to reserve:</p>
					<input
						id='reservation_date'
						type='date'
						name='reservation_date'
						onChange={changeHandler}
						value={reservation.reservation_date}
						placeholder='YYYY-MM-DD'
						required
						className='form-control'
					/>
				</label>
				<br />
				<label className='col-md-5 mb-3' htmlFor='reservation_time'>
					<p>Time to reserve:</p>
					<input
						id='reservation_time'
						type='time'
						name='reservation_time'
						onChange={changeHandler}
						value={reservation.reservation_time}
						placeholder='HH:MM'
						required
						className='form-control'
					/>
				</label>
			</div>
			<br />
			<div className='btn-group'>
				<button
					className='btn btn-dark'
					onClick={() => navigate(routes.dashboard)}
					type='button'
				>
					Cancel
				</button>
				<button className='btn btn-dark border-left' type='submit'>
					Submit
				</button>
			</div>
		</form>
	);
}
