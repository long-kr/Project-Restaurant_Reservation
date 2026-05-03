import React from 'react';

export default function SearchForm({
  submitHandler,
  changeHandler,
  phoneNumber,
}) {
  return (
    <div className="">
      <form onSubmit={submitHandler}>
        <label
          className="d-flex input-group mb-3 justify-content-center"
          htmlFor="mobile_number"
        >
          <div className="input-group-prepend">
            <button className="my-2 btn btn-outline-light" type="submit">
              Find
            </button>
          </div>
          <input
            id="mobile_number"
            type="tel"
            name="mobile_number"
            onChange={changeHandler}
            value={phoneNumber}
            placeholder="Enter a customer's phone number"
            required
            className="col-md-6 my-2 form-control"
          />
        </label>
      </form>
    </div>
  );
}
