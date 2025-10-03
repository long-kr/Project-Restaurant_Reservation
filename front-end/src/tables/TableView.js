import { Button } from '../components/ui';

function TableView({ table, finishButtonHandler, deleteTableHandler }) {
  return (
    <div className="mb-2 card rounded-0 bg-transparent">
      <div className="card-header bg-dark p-2 d-flex justify-content-between">
        <p style={{ fontFamily: 'Times New Roman' }} className="card-text m-0">
          TABLE: {table.table_name}
        </p>
      </div>

      <div
        style={{ backgroundColor: 'rgba(71, 71, 71, 0.8)' }}
        className="card-body p-2 d-flex justify-content-between"
      >
        <div>
          <p className="card-text">Capacity: {table.capacity}</p>
          <p className="card-text">Reservation ID: {table.reservation_id}</p>
        </div>

        <div>
          <p
            className="card-text m-0"
            data-table-id-status={`${table.table_id}`}
          >
            Status: {table.reservation_id ? 'Occupied' : 'Free'}
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between card-footer bg-dark p-1">
        <div>
          {table.reservation_id && (
            <Button
              data-table-id-finish={table.table_id}
              variant="dark"
              onClick={() => finishButtonHandler(table.table_id)}
            >
              Finish
            </Button>
          )}
        </div>

        <div>
          <Button
            variant="dark"
            onClick={() => deleteTableHandler(table.table_id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TableView;
