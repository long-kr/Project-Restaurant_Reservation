import { useCallback, useState } from 'react';

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for each field
 * @param {Function} onSubmit - Submit handler function
 * @returns {Object} Form state and handlers
 */
export function useFormValidation(
  initialValues,
  validationRules = {},
  onSubmit
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Validates a single field
   */
  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return null;

      for (const rule of rules) {
        const error = rule(value, values);
        if (error) return error;
      }
      return null;
    },
    [validationRules, values]
  );

  /**
   * Validates all fields
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  /**
   * Handles input changes
   */
  const handleChange = useCallback(
    e => {
      const { name, value, type, checked } = e.target;
      const fieldValue = type === 'checkbox' ? checked : value;

      setValues(prev => ({
        ...prev,
        [name]: fieldValue,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: null,
        }));
      }
    },
    [errors]
  );

  /**
   * Handles input blur events
   */
  const handleBlur = useCallback(
    e => {
      const { name, value } = e.target;

      setTouched(prev => ({
        ...prev,
        [name]: true,
      }));

      // Validate field on blur
      const error = validateField(name, value);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [validateField]
  );

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = {};
      Object.keys(validationRules).forEach(name => {
        allTouched[name] = true;
      });
      setTouched(allTouched);

      // Validate form
      if (validateForm() && onSubmit) {
        onSubmit(values);
      }
    },
    [validateForm, onSubmit, values, validationRules]
  );

  /**
   * Resets the form
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Sets a field value programmatically
   */
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Sets a field error programmatically
   */
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  /**
   * Gets field validation state
   */
  const getFieldProps = useCallback(
    name => ({
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur,
      error: touched[name] ? errors[name] : null,
      validation: touched[name]
        ? {
            isValid: !errors[name],
            message: errors[name],
          }
        : null,
    }),
    [values, handleChange, handleBlur, errors, touched]
  );

  return {
    values,
    errors,
    touched,
    isValid: Object.keys(errors).length === 0,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    resetForm,
    setFieldValue,
    setFieldError,
    getFieldProps,
  };
}

/**
 * Common validation rules
 */
export const validationRules = {
  required:
    (message = 'This field is required') =>
    value => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return message;
      }
      return null;
    },

  minLength: (min, message) => value => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max, message) => value => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters`;
    }
    return null;
  },

  email:
    (message = 'Please enter a valid email address') =>
    value => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        return message;
      }
      return null;
    },

  phone:
    (message = 'Please enter a valid phone number') =>
    value => {
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (value && !phoneRegex.test(value)) {
        return message;
      }
      return null;
    },

  min: (min, message) => value => {
    const numValue = Number(value);
    if (value && numValue < min) {
      return message || `Must be at least ${min}`;
    }
    return null;
  },

  max: (max, message) => value => {
    const numValue = Number(value);
    if (value && numValue > max) {
      return message || `Must be no more than ${max}`;
    }
    return null;
  },

  pattern: (regex, message) => value => {
    if (value && !regex.test(value)) {
      return message || 'Invalid format';
    }
    return null;
  },

  custom: (validator, message) => (value, allValues) => {
    const result = validator(value, allValues);
    if (result !== true && result !== null && result !== undefined) {
      return message || result;
    }
    return null;
  },
};
