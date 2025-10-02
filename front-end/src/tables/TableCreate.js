import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormActions, Input } from '../components';
import { ErrorAlert } from '../components/layout';
import { useFormValidation } from '../hooks/useFormValidation';
import { useCreateTable } from '../hooks/useTables';
import { tableRules } from '../utils/validations';

const initialTable = {
  table_name: '',
  capacity: '',
};

function TableCreate() {
  const navigate = useNavigate();
  const createTableMutation = useCreateTable();

  const [error, setError] = useState([]);

  const submitHandler = values => {
    const tableData = {
      ...values,
      capacity: parseInt(values.capacity),
    };

    createTableMutation.mutate(
      { table: tableData },
      {
        onSuccess: () => {
          navigate('/dashboard');
        },
        onError: errors => {
          setError(errors);
        },
      }
    );
  };

  const { getFieldProps, handleSubmit, isValid } = useFormValidation(
    initialTable,
    tableRules,
    submitHandler
  );

  return (
    <div>
      <h4 className="h3 text-center mb-0">Create New Table</h4>

      {error && error.map((err, i) => <ErrorAlert key={i} error={err} />)}

      <Form onSubmit={handleSubmit} className="col-md-6 mb-3 pl-0">
        <Input
          type="text"
          name="table_name"
          label="Table Name"
          placeholder="Table's name"
          required
          helpText="Minimum 2 characters"
          {...getFieldProps('table_name')}
        />

        <Input
          type="number"
          name="capacity"
          label="Capacity"
          placeholder="Number of people"
          required
          helpText="Minimum 1 person"
          {...getFieldProps('capacity')}
        />

        <FormActions>
          <Button variant="dark" onClick={() => navigate(-1)} type="button">
            Cancel
          </Button>
          <Button
            variant="dark"
            type="submit"
            className="border-left"
            disabled={!isValid}
            loading={createTableMutation.isPending}
          >
            Submit
          </Button>
        </FormActions>
      </Form>
    </div>
  );
}

export default TableCreate;
