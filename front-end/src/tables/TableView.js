import React from "react";

function TableView({ table, finishButtonHandler }) {

    return (
        <div className="p-2 mb-2 rounded border border-secondary">
            <p data-table-id-status={`${table.table_id}`}>
                Status: {table.reservation_id? "Occupied" : "Free"}
            </p>
            <p>Table Name: {table.table_name}</p>
            <p>Capacity: {table.capacity}</p>
            <p>Reservation ID: {table.reservation_id}</p>
            { table.reservation_id && 
                <button 
                    data-table-id-finish={table.table_id} 
                    className="btn btn-outline-light"
                    onClick={() => finishButtonHandler(table.table_id)}>
                    Finish
                </button>
            }
        </div>
    )
}

export default TableView;