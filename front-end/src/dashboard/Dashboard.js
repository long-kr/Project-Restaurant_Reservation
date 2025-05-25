import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Empty } from "../components/Empty";
import { Button } from "../components/ui/Button";
import ReservationsList from "../reservations/ReservationsList";
import TableList from "../tables/TableList";
import {
	deleteTable,
	listReservations,
	listTable,
	unSeatingTable,
} from "../utils/api";
import { next, previous } from "../utils/date-time";

// create Button component

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ todayDate }) {
	const history = useLocation();

	const [reservations, setReservations] = useState([]);
	const [tables, setTables] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);
	const [tablesError, setTablesError] = useState(null);
	const [date, setDate] = useState(() => {
		if (history.search) {
			return history.search.slice(6, 16);
		}
		return todayDate;
	});

	const loadDashboard = useCallback((signal) => {
		setReservationsError(null);
		setTablesError(null);
		listReservations({ date }, signal)
			.then(setReservations)
			.catch(setReservationsError);
		listTable().then(setTables).catch(setTablesError);
	}, []);

	const previousButtonHandler = () => {
		setDate(previous(date.toString()));
	};

	const todayButtonHandler = () => {
		setDate(todayDate);
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
			setTablesError(null);
			unSeatingTable(table_id)
				.then(() => loadDashboard())
				.catch(setTablesError);
		}
	}

	function deleteTableHandler(table_id) {
		if (
			window.confirm(
				"Are you sure to delete this table?\nThis cannot be undone."
			)
		) {
			setTablesError(null);
			deleteTable(table_id)
				.then(() => loadDashboard())
				.catch(setTablesError);
		}
	}

	useEffect(() => {
		const abortController = new AbortController();
		loadDashboard(abortController.signal);
		return () => {
			abortController.abort();
		};
	}, [date, loadDashboard]);

	return (
		<main>
			<div className='d-flex justify-content-around'>
				<h4 className='mb-0 h3 '>Date: {date}</h4>
			</div>

			<div role='group' className='d-flex py-2 btn-group '>
				<Button
					className='btn btn-dark border-right'
					onClick={previousButtonHandler}
				>
					Previous day
				</Button>

				<Button className='btn btn-dark' onClick={todayButtonHandler}>
					Today
				</Button>

				<Button className='btn btn-dark' onClick={nextButtonHandler}>
					Next day
				</Button>
			</div>

			<section className='row justify-content-between'>
				<div className='col-lg-8 py-2'>
					{reservations.length ? (
						<ReservationsList
							reservations={reservations}
							setError={setReservationsError}
						/>
					) : <Empty/>}
				</div>

				<div className='col-lg-4 order-first order-lg-2'>
					<div id='table' className='carousel slide' data-ride='carousel'>
						<div className='carousel-inner'>
							{!!tables.length && (
								<TableList
									tables={tables}
									unSeatingHandler={finishButtonHandler}
									deleteTableHandler={deleteTableHandler}
								/>
							)}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default Dashboard;
