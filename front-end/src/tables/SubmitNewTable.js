import React from "react";
import { useHistory } from "react-router";

function SubmitNewTable({submitHandler, changeHandler, table}) {
    const history = useHistory();

    return (
        <div>
            <form onSubmit={submitHandler}>
                <label htmlFor="table_name">
                    Table Name:
                    <input
                        id="table_name"
                        type="text"
                        name="table_name"
                        onChange={changeHandler}
                        value={table.table_name}
                        placeholder="Table's name"
                        minLength="2"
                        required
                    />
                </label>
                <br />
                <label htmlFor="capacity">
                    Capacity:
                    <input
                        id="capacity"
                        type="number"
                        name="capacity"
                        onChange={changeHandler}
                        value={table.capacity}
                        placeholder="Capacity"
                        min="1"
                        required
                    />
                </label>
                <br />
                <button onClick={() => history.goBack()}>Cancel</button>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default SubmitNewTable;