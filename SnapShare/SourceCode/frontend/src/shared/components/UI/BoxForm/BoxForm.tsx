// react imports
import React from 'react';

// bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//my imports
import classes from './BoxForm.module.css';

type BoxFormProps = {
  sm: number;
  md: number;
  children: React.ReactNode;
};

const BoxForm: React.FC<BoxFormProps> = ({sm, md, children }) => {
  return (
      <Row className='justify-content-center'>
        <Col className={`${classes['box-form']} bg-light`} md={md} sm={sm}>
            {children}
        </Col>
      </Row>
  );
};

export default BoxForm;
