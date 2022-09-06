import React from "react";

function TableView({ table, finishButtonHandler }) {

    return (
        <div>
            <p data-table-id-status={`${table.table_id}`}>
                {table.reservation_id? "Occupied" : "Free"}
            </p>
            <p>Table Name: {table.table_name}</p>
            <p>Capacity: {table.capacity}</p>
            <p>Reservation ID: {table.reservation_id}</p>
            { table.reservation_id && 
                <button 
                    data-table-id-finish={table.table_id} 
                    onClick={() => finishButtonHandler(table.table_id)}>
                    Finish
                </button>
            }
        </div>
    )
}

export default TableView;