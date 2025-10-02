export function Empty({ message = 'No data available.' }) {
  return (
    <div className="card text-center bg-transparent">
      <div className="card-body">
        <p className="text-center">{message}</p>
      </div>
    </div>
  );
}
