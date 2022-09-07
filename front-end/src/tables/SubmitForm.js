import React from "react";
import { useHistory } from "react-router";

function SubmitForm({submitHandler, changeHandler, table}) {
    const history = useHistory();

    return (
        <div>
            <form onSubmit={submitHandler}>
                <label className="col-md-5 mb-3 pl-0" htmlFor="table_name">
                    <span>Table Name:</span>
                    <input
                        id="table_name"
                        type="text"
                        name="table_name"
                        onChange={changeHandler}
                        value={table.table_name}
                        placeholder="Table's name"
                        minLength="2"
                        required
                        className="form-control"
                    />
                </label>
                <br />
                <label className="col-md-5 mb-3 pl-0"htmlFor="capacity">
                    <span>Capacity:</span>
                    <input
                        id="capacity"
                        type="number"
                        name="capacity"
                        onChange={changeHandler}
                        value={table.capacity}
                        placeholder="Capacity"
                        min="1"
                        required
                        className="form-control"
                    />
                </label>
                <br />
                <button className="mx-3 my-2 btn btn-outline-light btn-lg" 
                    onClick={() => history.goBack()}
                >
                    Cancel
                </button>
                <button className="my-2 mx-2 btn btn-outline-light btn-lg" type="submit">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default SubmitForm;