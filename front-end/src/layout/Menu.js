import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="position-sticky">
      <div className="list-group list-group-flush mx-3 mt-4">
        <Link
          className="list-group-item list-group-item-action bg-transparent px-0 py-3 ripple"
          to="/"
        >
          <div className="sidebar-brand-text text-center" >
            <h5 className="h4">Menu</h5>
          </div>
        </Link>
        <hr className="sidebar-divider my-0" />

        <ul className="nav navbar-nav" id="accordionSidebar">
          <li>
            <Link className="list-group-item list-group-item-action border-0 bg-transparent py-4 px-0 ripple" to="/dashboard">
              <span className="oi oi-dashboard">
                &nbsp;Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link className="list-group-item list-group-item-action border-right-0 border-left-0 bg-transparent py-4 px-0 ripple" to="/search">
              <span className="oi oi-magnifying-glass">
                &nbsp;Search
              </span>
            </Link>
          </li>
          <li>
            <Link className="list-group-item list-group-item-action border-right-0 border-left-0 bg-transparent py-4 px-0 ripple" to="/reservations/new">
              <span className="oi oi-plus">
                &nbsp;New Reservation
              </span>
            </Link>
          </li>
          <li>
            <Link className="list-group-item list-group-item-action border-right-0 border-left-0 bg-transparent py-4 px-0 ripple" to="/tables/new">
              <span className="oi oi-layers">
                &nbsp;New Table
              </span>
            </Link>
          </li>
        </ul>
        <div className="text-center d-none d-md-inline">
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
        </div>
      </div>
    </nav>
  );
}

export default Menu;
