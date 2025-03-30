// react imports
import React from 'react';

// bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//my imports
import classes from './BoxForm.module.css';

const BoxForm: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
      <Row className='justify-content-center'>
        <Col className={`${classes['box-form']} bg-light`} md={7} sm={12}>
            {children}
        </Col>
      </Row>
  );
};

export default BoxForm;
