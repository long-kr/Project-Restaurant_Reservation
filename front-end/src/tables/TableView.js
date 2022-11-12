import React from "react";

function TableView({ table, finishButtonHandler }) {

    return (
        <div>
            <div className="card bg-dark mt-3">
                <div style={{fontFamily: "Baskervville"}} className="card-header">Table: {table.table_name}</div> 
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
                <div className="d-flex justify-content-center">
                    <a className="carousel" role="button" href="#table" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel" role="button" href="#table" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default TableView;