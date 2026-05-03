import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../components/layout';
import {
  Button,
  Form,
  FormActions,
  FormFieldGroup,
  Input,
} from '../components/ui';
import { useFormValidation } from '../hooks/useFormValidation';
import { useCreateReservation } from '../hooks/useReservations';
import { today } from '../utils/date-time';
import { reservationRules } from '../utils/validations';

const initialReservation = {
  first_name: '',
  last_name: '',
  mobile_number: '',
  people: '',
  reservation_date: '',
  reservation_time: '',
};

function ReservationCreate() {
  const navigate = useNavigate();
  const createReservationMutation = useCreateReservation();
  const [errorMsg, setErrorMsg] = useState([]);

  const onSubmit = values => {
    const reservationData = {
      ...values,
      people: parseInt(values.people),
    };

    createReservationMutation.mutate(
      { reservation: reservationData },
      {
        onSuccess: () => {
          navigate(`/dashboard?date=${values.reservation_date}`);
        },
        onError: errors => {
          if (errors.name === 'VALIDATION_ERROR') {
            const validation = errors?.cause?.validation || [];
            const validationErrors = validation.map(val => val?.message);
            setErrorMsg(validationErrors);
          }
        },
      }
    );
  };

  const { getFieldProps, handleSubmit } = useFormValidation(
    initialReservation,
    reservationRules,
    onSubmit
  );

  return (
    <div>
      <h4 className="h3 text-center mb-0">Create New Reservation</h4>

      {errorMsg.map((err, i) => (
        <ErrorAlert key={i} error={err} />
      ))}

      <Form onSubmit={handleSubmit}>
        <FormFieldGroup className="row">
          <div className="col-md-6">
            <Input
              type="text"
              label="First Name"
              placeholder="Customer first name"
              helpText="Minimum 2 characters"
              {...getFieldProps('first_name')}
              required
            />
          </div>
          <div className="col-md-6">
            <Input
              type="text"
              label="Last Name"
              placeholder="Customer last name"
              helpText="Minimum 2 characters"
              {...getFieldProps('last_name')}
              required
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
              required
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
              required
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
              required
            />
          </div>
          <div className="col-md-6">
            <Input
              type="time"
              label="Reservation Time"
              helpText="Between 10:30 AM and 9:30 PM"
              {...getFieldProps('reservation_time')}
              required
            />
          </div>
        </FormFieldGroup>

        <FormActions>
          <Button variant="dark" onClick={() => navigate(-1)} type="button">
            Cancel
          </Button>

          <Button
            variant="dark"
            type="submit"
            loading={createReservationMutation.isPending}
            className="border-left"
          >
            Submit
          </Button>
        </FormActions>
      </Form>
    </div>
  );
}

export default ReservationCreate;
