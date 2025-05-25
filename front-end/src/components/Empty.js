export function Empty({ message = "No data available." }) {
	return (
		<div className='card text-center'>
			<div className='card-body'>
				<p className='text-center'>{message}</p>
			</div>
		</div>
	);
}
