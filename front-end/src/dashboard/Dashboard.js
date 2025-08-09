import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Empty } from "../components/Empty";
import { Button } from "../components/ui/Button";
import ReservationView from "../reservations/ReservationView";
import TableView from "../tables/TableView";
import {
	deleteTable,
	listReservations,
	listTable,
	setReservationStatus,
	unSeatingTable,
} from "../utils/api";
import { next, previous, today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
	const todayDateString = today();
	const history = useLocation();

	const [reservations, setReservations] = useState([]);
	const [tables, setTables] = useState([]);
	const [date, setDate] = useState(() =>
		history.search ? history.search.slice(6, 16) : todayDateString
	);

	const loadDashboard = useCallback(
		async (signal) => {
			try {
				const reservations = await listReservations({ date }, signal);
				setReservations(reservations);

				const tables = await listTable();
				setTables(tables);
			} catch (error) {}
		},
		[date]
	);

	const previousButtonHandler = () => {
		setDate(previous(date.toString()));
	};

	const todayButtonHandler = () => {
		setDate(todayDateString);
	};

	const nextButtonHandler = () => {
		setDate(next(date.toString()));
	};

	function finishButtonHandler(table_id) {
		if (
			window.confirm(
				"Is this table ready to seat new guests?\nThis cannot be undone."
			)
		) {
			unSeatingTable(table_id)
				.then(() => loadDashboard())
				.catch();
		}
	}

	function deleteTableHandler(table_id) {
		if (
			window.confirm(
				"Are you sure to delete this table?\nThis cannot be undone."
			)
		) {
			deleteTable(table_id)
				.then(() => loadDashboard())
				.catch();
		}
	}

	function cancelReservationHandler(reservation_id) {
		if (
			window.confirm(
				"Do you want to cancel this reservation?\nThis cannot be undone."
			)
		) {
			const abortController = new AbortController();
			setReservationStatus(
				reservation_id,
				{ status: "cancelled" },
				abortController.signal
			)
				.then(() => {
					window.location.reload();
				})
				.catch();
			return () => abortController.abort();
		}
	}

	useEffect(() => {
		const abortController = new AbortController();
		loadDashboard(abortController.signal);
		return () => {
			abortController.abort();
		};
	}, [loadDashboard]);

	return (
		<main>
			<div className='d-flex justify-content-around'>
				<h4 className='mb-0 h3 '>Date: {date}</h4>
			</div>

			<div role='group' className='d-flex py-2 btn-group '>
				<Button className='btn-dark' onClick={previousButtonHandler}>
					Previous day
				</Button>

				<Button className='btn-dark' onClick={todayButtonHandler}>
					Today
				</Button>

				<Button className='btn-dark' onClick={nextButtonHandler}>
					Next day
				</Button>
			</div>

			<section className='row justify-content-between'>
				<div className='col-lg-8'>
					{reservations.length ? (
						<div className='py-2'>
							{reservations.map((reservation) => (
								<ReservationView
									key={reservation.reservation_id}
									reservation={reservation}
									cancelHandler={cancelReservationHandler}
								/>
							))}
						</div>
					) : (
						<Empty />
					)}
				</div>

				<div className='col-lg-4 order-first order-lg-2'>
					<div id='table' className='carousel slide' data-ride='carousel'>
						<div className='carousel-inner'>
							{!!tables.length ? (
								tables.map((table, i) => (
									<div
										className={
											i === 0 ? "carousel-item active" : "carousel-item"
										}
									>
										<TableView
											key={table.table_id}
											table={table}
											finishButtonHandler={finishButtonHandler}
											deleteTableHandler={deleteTableHandler}
										/>
									</div>
								))
							) : (
								<Empty />
							)}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default Dashboard;
