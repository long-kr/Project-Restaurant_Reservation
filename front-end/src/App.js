import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Layout from "./layout/Layout";
import NotFound from "./layout/NotFound";
import ReservationCreate from "./reservations/ReservationCreate";
import ReservationsEdit from "./reservations/ReservationsEdit";
import Search from "./search/Search";
import SetReservationSeat from "./seats/SetReservationSeat";
import TableCreate from "./tables/TableCreate";
import { routes } from "./utils/routes";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		// errorElement: <ErrorPage />,
		children: [
			{ index: true, element: <Dashboard /> },
			...[routes.dashboard, routes.reservations].map((path) => ({
				path,
				element: <Dashboard />,
			})),
			{ path: routes.reservationsNew, element: <ReservationCreate /> },
			{
				path: routes.reservationsEdit(":reservation_id"),
				element: <ReservationsEdit />,
			},
			{
				path: routes.reservationsSeat(":reservation_id"),
				element: <SetReservationSeat />,
			},
			{ path: routes.tablesNew, element: <TableCreate /> },
			{ path: routes.search, element: <Search /> },
			{ path: routes.notFound, element: <NotFound /> },
		],
	},
]);

function App() {
	return (
		<RouterProvider future={{ v7_startTransition: true }} router={router} />
	);
}

export default App;
