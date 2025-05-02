import React from 'react';
import { Spinner } from 'react-bootstrap';
import styles from './SpinnerOverlay.module.css';

const SpinnerOverlay: React.FC = () => {
  return (
    <div className={styles.overlay} role="status" aria-label="Loading">
      <Spinner animation="border" variant="primary" role="status" />
    </div>
  );
};

export default SpinnerOverlay;