import React, { Fragment } from 'react';

// Bootstrap imports
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Alert from 'react-bootstrap/Alert';
import AlertIcon from '../Icons/AlertIcon';

// Import FieldError from react-hook-form
import { FieldError } from 'react-hook-form';

type InputProps = {
  label: string;
  type: string;
  required: boolean;
  error?: FieldError; // More explicit type for error
} & React.ComponentPropsWithoutRef<typeof Form.Control>; // Pass all Form.Control props

const Input: React.FC<InputProps> = ({
  label,
  type,
  required,
  error,
  ...rest
}) => {
  let labelContent;
  if (required) {
    labelContent = (
      <Fragment>
        {label}
        <span className='text-danger fw-bold'>{" "}*</span>
      </Fragment>
    );
  } else {
    labelContent = label;
  }

  return (
    <Fragment>
      <FloatingLabel
        controlId={`floating${label}`}
        label={labelContent}
        className="mb-2"
      >
        <Form.Control type={type} placeholder={label} {...rest} />
      </FloatingLabel>
      {error && error.message && (
        <Alert variant="danger">
          <AlertIcon width={16} height={16} /> {error.message}
        </Alert>
      )}
    </Fragment>
  );
};

export default Input;
