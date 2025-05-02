import React from 'react';
import { Spinner } from 'react-bootstrap';

const SpinnerOverlay: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      role="status"
      aria-label="Loading"
    >
      <Spinner animation="border" variant="primary" role="status" />
    </div>
  );
};

export default SpinnerOverlay;
