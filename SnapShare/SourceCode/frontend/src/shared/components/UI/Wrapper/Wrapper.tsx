// react imports
import React from 'react';

//bootstrap imports
import Container from 'react-bootstrap/Container';

//my imports

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <Container>
        {children}
      </Container>
    );
  };

export default Wrapper;