// react imports
import React, { Fragment } from 'react';

//bootstrap impots
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Alert from 'react-bootstrap/Alert';
import AlertIcon from '../Icons/AlertIcon';

type InputProps = {
  label: string;
  type: string;
};

const Input: React.FC<InputProps> = ({ type, label }) => {
  return (
    <Fragment>
      <FloatingLabel
        controlId={`floating${label}`}
        label={label}
        className="mb-2"
      >
        <Form.Control type={type} placeholder="name@example.com" />
      </FloatingLabel>
      <Alert variant="danger">
        <AlertIcon width={16} height={16} />{" "}myerror
      </Alert>
    </Fragment>
  );
};

export default Input;
