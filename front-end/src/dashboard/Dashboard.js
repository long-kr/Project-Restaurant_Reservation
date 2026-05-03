import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Empty, Loading } from '../components/ui';

import {
  useReservationsByDate,
  useUpdateReservationStatus,
} from '../hooks/useReservations';
import { useDeleteTable, useTables, useUnseatTable } from '../hooks/useTables';
import ReservationView from '../reservations/ReservationView';
import TableView from '../tables/TableView';
import { next, previous, today } from '../utils/date-time';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const todayDateString = today();
  const history = useLocation();
  const queryDate = history.search
    ? history.search.slice(6, 16)
    : todayDateString;

  const [date, setDate] = useState(() => queryDate);

  // Use React Query hooks for data fetching
  const {
    data: reservations = [],
    isLoading: reservationsLoading,
    error: reservationsError,
  } = useReservationsByDate(date);

  const {
    data: tables = [],
    isLoading: tablesLoading,
    error: tablesError,
  } = useTables();

  // Mutation hooks
  const updateReservationStatusMutation = useUpdateReservationStatus();
  const unseatTableMutation = useUnseatTable();
  const deleteTableMutation = useDeleteTable();

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
        'Is this table ready to seat new guests?\nThis cannot be undone.'
      )
    ) {
      unseatTableMutation.mutate({ tableId: table_id });
    }
  }

  function deleteTableHandler(table_id) {
    if (
      window.confirm(
        'Are you sure to delete this table?\nThis cannot be undone.'
      )
    ) {
      deleteTableMutation.mutate({ tableId: table_id });
    }
  }

  function cancelReservationHandler(reservation_id) {
    if (
      window.confirm(
        'Do you want to cancel this reservation?\nThis cannot be undone.'
      )
    ) {
      updateReservationStatusMutation.mutate({
        reservationId: reservation_id,
        data: { status: 'cancelled' },
      });
    }
  }

  // Loading and error states
  const isLoading = reservationsLoading || tablesLoading;
  const hasError = reservationsError || tablesError;

  if (hasError) {
    return (
      <main>
        <div className="alert alert-danger">
          Error loading dashboard data. Please try again.
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="d-flex justify-content-around">
        <h4 className="mb-0 h3 ">Date: {date}</h4>
      </div>

      <div role="group" className="d-flex py-2 btn-group ">
        <Button className="btn-dark" onClick={previousButtonHandler}>
          Previous day
        </Button>

        <Button className="btn-dark" onClick={todayButtonHandler}>
          Today
        </Button>

        <Button className="btn-dark" onClick={nextButtonHandler}>
          Next day
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <section className="row justify-content-between">
          <div className="col-lg-8">
            {reservations.length ? (
              reservations.map(reservation => (
                <ReservationView
                  key={reservation.reservation_id}
                  reservation={reservation}
                  cancelHandler={cancelReservationHandler}
                />
              ))
            ) : (
              <Empty />
            )}
          </div>

          <div className="col-lg-4 order-first order-lg-2 row">
            {!!tables.length ? (
              tables.map(table => (
                <div className="col-lg-12 col-sm-6" key={table.table_id}>
                  <TableView
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
        </section>
      )}
    </main>
  );
}

export default Dashboard;
