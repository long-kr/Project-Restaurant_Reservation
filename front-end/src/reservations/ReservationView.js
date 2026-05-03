import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { formatAsDate } from '../utils/date-time';

/**
 * Reservation View for <ReservationList/>
 */
function ReservationView({ reservation, cancelHandler }) {
  return (
    <div className="mb-2 mx-0 card bg-dark rounded-0 bg-transparent">
      <div className="card-header bg-dark p-2 d-flex justify-content-between">
        <p className="card-text m-0">
          GUEST: {reservation.first_name} {reservation.last_name}
        </p>
      </div>

      <div
        style={{ backgroundColor: 'rgba(71, 71, 71, 0.8)' }}
        className="card-body d-flex justify-content-between"
      >
        <div>
          <p>Reservation ID: {reservation.reservation_id}</p>
          <p>Mobile: {reservation.mobile_number}</p>
          <p>Guest Number: {reservation.people}</p>
        </div>

        <div>
          <p>Status: {reservation.status}</p>
          <p>Date: {formatAsDate(reservation.reservation_date)}</p>
          <p>Time: {reservation.reservation_time}</p>
        </div>
      </div>

      <div className="card-footer bg-dark p-1">
        <div className={clsx('d-flex justify-content-around')}>
          <Link
            className="btn border-right"
            to={`/reservations/${reservation.reservation_id}/edit`}
          >
            Edit
          </Link>
          <Link
            data-reservation-id-cancel={reservation.reservation_id}
            className={clsx('btn', {
              disabled: reservation.status === 'cancelled',
            })}
            role="button"
            onClick={() => cancelHandler(reservation.reservation_id)}
          >
            Cancel
          </Link>

          <Link
            to={`/reservations/${reservation.reservation_id}/seat`}
            className={clsx('btn border-left', {
              disabled: reservation.status === 'booked',
            })}
          >
            Seat
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReservationView;
