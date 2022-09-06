import React from "react";

/**
 * Dashboard <TableList />
 */
function TableList({ table, unSeatingHandler }) { 
    const { table_id } = table;
    
    const finishButtonHandler = () => {
        unSeatingHandler(table_id);
    };

    return (
        <div>
            <p data-table-id-status={`${table_id}`}>
                {table.reservation_id? "Occupied" : "Free"}
            </p>
            <p>Table name: {table.table_name}</p>
            <p>Capacity: {table.capacity}</p>
            <p>Reservation ID: {table.reservation_id}</p>
            { table.reservation_id && 
                <button data-table-id-finish={table.table_id} onClick={finishButtonHandler}>
                    Finish
                </button>
            }
        </div>
    )
};

export default TableList;