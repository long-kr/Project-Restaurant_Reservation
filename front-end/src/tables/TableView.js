import React from "react";

function TableView({ table, finishButtonHandler }) {

    return (
        <div>
            <div className="card bg-dark mt-3">
                <div className="card-header">Name: {table.table_name}</div> 
            </div>
            <div className="card-body light-background">
                <p className="card-text" data-table-id-status={`${table.table_id}`}>
                    Status: {table.reservation_id? "Occupied" : "Free"}
                </p>
                <p className="card-text">Capacity: {table.capacity}</p>
                <p className="card-text">Reservation ID: {table.reservation_id}</p>
                { table.reservation_id && 
                    <button 
                        data-table-id-finish={table.table_id} 
                        className="btn btn-outline-light"
                        onClick={() => finishButtonHandler(table.table_id)}>
                        Finish
                    </button>
                }
            </div>
        </div>
    )
}

export default TableView;