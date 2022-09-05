import React from "react";

export default function SearchForm({submitHandler, changeHandler, phoneNumber}) {
    
    return (
        <div>
            <form onSubmit={submitHandler}>
                <label htmlFor="mobile_number">
                    Search by customer's phone number
                    <br />
                    <input
                        id="mobile_number"
                        type="tel"
                        name="mobile_number"
                        onChange={changeHandler}
                        value={phoneNumber}
                        placeholder="Enter a customer's phone number"
                        required
                    />
                </label>
                <button type="submit">Find</button>
            </form>
        </div>
    )
};