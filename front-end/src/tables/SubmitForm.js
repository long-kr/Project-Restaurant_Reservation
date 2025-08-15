import { useNavigate } from "react-router";

function SubmitForm({ submitHandler, changeHandler, table }) {
	const navigate = useNavigate();
	return (
		<div>
			<form onSubmit={submitHandler}>
				<label className='col-md-5 mb-3 pl-0' htmlFor='table_name'>
					<p>Table Name:</p>
					<input
						id='table_name'
						type='text'
						name='table_name'
						onChange={changeHandler}
						value={table.table_name}
						placeholder="Table's name"
						minLength='2'
						required
						className='form-control'
					/>
				</label>
				<br />
				<label className='col-md-5 mb-3 pl-0' htmlFor='capacity'>
					<p>Capacity:</p>
					<input
						id='capacity'
						type='number'
						name='capacity'
						onChange={changeHandler}
						value={table.capacity}
						placeholder='Capacity'
						min='1'
						required
						className='form-control'
					/>
				</label>
				<br />
				<div className='btn-group'>
					<button className='btn btn-dark' onClick={() => navigate(-1)}>
						Cancel
					</button>
					<button className='btn btn btn-dark border-left' type='submit'>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}

export default SubmitForm;
