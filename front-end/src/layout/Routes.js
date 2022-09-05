import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationCreate from "../reservations/ReservationCreate";
import TableCreate from "../tables/TableCreate";
import ReservationSeat from "../seats/ReservationSeat";
import Search from "../search/Search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
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
      <Route path={`/reservations/:reservation_id/seat`}>
        <ReservationSeat />
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
