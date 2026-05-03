import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorAlert } from '../components/layout';
import {
  Button,
  Form,
  FormActions,
  FormFieldGroup,
  Input,
  Loading,
} from '../components/ui';
import { useFormValidation } from '../hooks/useFormValidation';
import { useReservation, useUpdateReservation } from '../hooks/useReservations';
import { formatAsDate, today } from '../utils/date-time';
import { routes } from '../utils/routes';
import { reservationRules } from '../utils/validations';

const initialReservation = {
  first_name: '',
  last_name: '',
  mobile_number: '',
  people: '',
  reservation_date: '',
  reservation_time: '',
};

function ReservationsEdit() {
  const navigate = useNavigate();
  const { reservation_id } = useParams();
  const updateReservationMutation = useUpdateReservation();
  const [errorMsg, setErrorMsg] = useState([]);

  const {
    data: reservationData,
    isLoading,
    error,
  } = useReservation(reservation_id);

  const onSubmit = values => {
    const reservationData = {
      ...values,
      people: parseInt(values.people),
    };

    updateReservationMutation.mutate(
      {
        reservationId: reservation_id,
        data: reservationData,
      },
      {
        onSuccess: () => {
          navigate(`${routes.dashboard}?date=${values.reservation_date}`);
        },
        onError: error => {
          const validation = error?.cause?.validation || [];
          const validationErrors = validation.map(val => val?.message);
          setErrorMsg(validationErrors);
        },
      }
    );
  };

  const { getFieldProps, handleSubmit, setFieldValue, resetForm } =
    useFormValidation(initialReservation, reservationRules, onSubmit);

  // Update form values when reservation data is fetched
  useEffect(() => {
    if (reservationData) {
      const formattedData = {
        ...reservationData,
        reservation_date: formatAsDate(reservationData.reservation_date),
      };

      Object.keys(formattedData).forEach(key => {
        setFieldValue(key, formattedData[key]);
      });
    }

    if (error) {
      setErrorMsg([error.message]);
    }
  }, [reservationData, setFieldValue, error, setErrorMsg]);

  return (
    <div>
      <h4 className="h3 text-center mb-0">
        Edit Reservation #{reservation_id}
      </h4>

      {errorMsg.map((err, i) => (
        <ErrorAlert key={i} error={err} />
      ))}

      {isLoading ? (
        <Loading />
      ) : (
        <Form
          onSubmit={handleSubmit}
          isLoading={updateReservationMutation.isPending}
        >
          <FormFieldGroup className="row">
            <div className="col-md-6">
              <Input
                type="text"
                label="First Name"
                placeholder="Customer first name"
                helpText="Minimum 2 characters"
                {...getFieldProps('first_name')}
              />
            </div>
            <div className="col-md-6">
              <Input
                type="text"
                label="Last Name"
                placeholder="Customer last name"
                helpText="Minimum 2 characters"
                {...getFieldProps('last_name')}
              />
            </div>
          </FormFieldGroup>

          <FormFieldGroup className="row">
            <div className="col-md-6">
              <Input
                type="tel"
                label="Mobile Number"
                placeholder="xxx-xxx-xxxx"
                helpText="Format: xxx-xxx-xxxx"
                {...getFieldProps('mobile_number')}
              />
            </div>
            <div className="col-md-6">
              <Input
                type="number"
                label="Number of Guests"
                placeholder="How many guests?"
                min="1"
                max="20"
                helpText="Between 1 and 20 people"
                {...getFieldProps('people')}
              />
            </div>
          </FormFieldGroup>

          <FormFieldGroup className="row">
            <div className="col-md-6">
              <Input
                type="date"
                label="Reservation Date"
                min={today()}
                helpText="Cannot be a past date or Tuesday"
                {...getFieldProps('reservation_date')}
              />
            </div>
            <div className="col-md-6">
              <Input
                type="time"
                label="Reservation Time"
                helpText="Between 10:30 AM and 9:30 PM"
                {...getFieldProps('reservation_time')}
              />
            </div>
          </FormFieldGroup>

          <FormActions className="d-flex">
            <Button variant="dark" onClick={() => navigate(-1)} type="button">
              Cancel
            </Button>

            <Button
              variant="dark"
              className="border-left border-right"
              onClick={resetForm}
              type="button"
            >
              Reset Form
            </Button>

            <Button
              variant="dark"
              type="submit"
              loading={updateReservationMutation.isPending}
            >
              Update Reservation
            </Button>
          </FormActions>
        </Form>
      )}
    </div>
  );
}

export default ReservationsEdit;
