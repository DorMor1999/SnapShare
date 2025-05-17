import React, { Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FieldError } from 'react-hook-form';

type Option = {
  label: string;
  value: string | number;
};

type InputProps = {
  label: string;
  type: string;
  required?: boolean;
  error?: FieldError;
  options?: Option[]; // Only used when type === 'select'
} & React.ComponentPropsWithoutRef<typeof Form.Control>;

const Input: React.FC<InputProps> = ({
  label,
  type,
  required,
  error,
  options = [],
  ...rest
}) => {
  const labelContent = required ? (
    <>
      {label}
      <span className="text-danger fw-bold"> *</span>
    </>
  ) : (
    label
  );

  return (
    <>
      <FloatingLabel
        controlId={`floating${label}`}
        label={labelContent}
        className="mb-2"
      >
        {type === 'select' ? (
          <Form.Select {...rest}>
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Form.Select>
        ) : (
          <Form.Control type={type} placeholder={label} {...rest} />
        )}
      </FloatingLabel>

      {error?.message && (
        <p className="text-danger">
          <Fragment>{error.message}</Fragment>
        </p>
      )}
    </>
  );
};

export default Input;