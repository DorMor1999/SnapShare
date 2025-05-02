// react imports
import React from 'react';

import classes from './Wrapper.module.css';
//bootstrap imports
import Container from 'react-bootstrap/Container';

//my imports

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <Container className={classes["my-wrapper"]}>
        {children}
      </Container>
    );
  };

export default Wrapper;