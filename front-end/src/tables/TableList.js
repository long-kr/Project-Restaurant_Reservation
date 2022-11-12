import React from "react";
import TableView from "./TableView";

/**
 * Dashboard <TableList />
 */
function TableList({ tables, unSeatingHandler }) { 
    
    const list = tables.map((table, i) => (
        <div className={i===0 ? "carousel-item active":"carousel-item"}>
            <TableView 
                key={table.table_id}
                table={table}
                finishButtonHandler={unSeatingHandler}
            />
        </div>
    ));

    return list
};

export default TableList;