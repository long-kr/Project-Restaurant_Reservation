import React from "react";
import TableView from "./TableView";

/**
 * Dashboard <TableList />
 */
function TableList({ tables, unSeatingHandler }) { 
    
    const list = tables.map((table) => (
        <TableView 
            key={table.table_id}
            table={table}
            finishButtonHandler={unSeatingHandler}
        />
    ));

    return list
};

export default TableList;