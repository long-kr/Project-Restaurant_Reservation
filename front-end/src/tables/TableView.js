function TableView({ table, finishButtonHandler, deleteTableHandler }) {
  return (
    <div className="mb-2">
      <div className="card bg-dark">
        <div style={{ fontFamily: 'Baskervville' }} className="card-header">
          Table: {table.table_name}
        </div>
      </div>

      <div className="card-body light-background">
        <p className="card-text" data-table-id-status={`${table.table_id}`}>
          Status: {table.reservation_id ? 'Occupied' : 'Free'}
        </p>
        <p className="card-text">Capacity: {table.capacity}</p>
        <p className="card-text">Reservation ID: {table.reservation_id}</p>
      </div>

      <div className="d-flex justify-content-between card-footer bg-dark">
        <div>
          {table.reservation_id && (
            <button
              data-table-id-finish={table.table_id}
              className="btn btn-dark"
              onClick={() => finishButtonHandler(table.table_id)}
            >
              Finish
            </button>
          )}
        </div>

        <div>
          <button
            className="btn btn-dark"
            onClick={() => deleteTableHandler(table.table_id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableView;
