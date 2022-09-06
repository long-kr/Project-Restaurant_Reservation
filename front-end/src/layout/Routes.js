import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { today } from "../utils/date-time";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import ReservationCreate from "../reservations/ReservationCreate";
import TableCreate from "../tables/TableCreate";
import SetReservationSeat from "../seats/SetReservationSeat";
import Search from "../search/Search";
import ReservationsEdit from "../reservations/ReservationsEdit";

/**
 * Defines all the routes for the application.
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard/">
        <Dashboard todayDate={today()} />
      </Route>
      <Route path="/reservations/new">
        <ReservationCreate date={today()}/>
      </Route>
      <Route exact={true} path={`/reservations/:reservation_id/seat`}>
        <SetReservationSeat />
      </Route>
      <Route path={`/reservations/:reservation_id/edit`}>
        <ReservationsEdit />
      </Route>
      <Route path="/tables/new">
        <TableCreate />
      </Route>
      <Route path={`/search`}>
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
