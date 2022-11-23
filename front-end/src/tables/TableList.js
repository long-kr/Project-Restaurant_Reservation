import React from "react";
import TableView from "./TableView";

/**
 * Dashboard <TableList />
 */
function TableList({ tables, unSeatingHandler, deleteTableHandler }) { 
    
    const list = tables.map((table, i) => (
        <div className={i===0 ? "carousel-item active":"carousel-item"}>
            <TableView 
                key={table.table_id}
                table={table}
                finishButtonHandler={unSeatingHandler}
                deleteTableHandler={deleteTableHandler}
            />
        </div>
    ));

    return list
};

export default TableList;