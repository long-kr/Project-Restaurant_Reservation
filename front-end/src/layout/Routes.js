import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationCreate from "../reservations/ReservationCreate";
import ReservationsEdit from "../reservations/ReservationsEdit";
import Search from "../search/Search";
import SetReservationSeat from "../seats/SetReservationSeat";
import TableCreate from "../tables/TableCreate";
import { today } from "../utils/date-time";
import NotFound from "./NotFound";

// TODO: fix id name
/**
 * Defines all the routes for the application.
 * @returns {JSX.Element}
 */
function Routes() {
  const todayString = today();
  
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard/">
        <Dashboard todayDate={todayString} />
      </Route>
      <Route path="/reservations/new">
        <ReservationCreate />
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
