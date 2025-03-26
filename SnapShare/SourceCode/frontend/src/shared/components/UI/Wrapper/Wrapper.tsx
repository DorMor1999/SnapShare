// react imports
import React from 'react';

//bootstrap imports
import Container from 'react-bootstrap/Container';

//my imports
import classes from './Wrapper.module.css';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <Container className={classes.wrapper}>
        {children}
      </Container>
    );
  };

export default Wrapper;