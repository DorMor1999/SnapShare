import React, { Fragment } from 'react';
import { Spinner } from 'react-bootstrap';
import styles from './SpinnerOverlay.module.css';

interface SpinnerProps {
  msg?: string;
}

const SpinnerOverlay: React.FC<SpinnerProps> = ({ msg = null }) => {
  return (
    <div className={styles.overlay} role="status" aria-label="Loading">
      <Spinner animation="border" variant="primary" role="status" />
      {/* {msg && (
        <Fragment>
          <br/>
          <p>{msg}</p>
        </Fragment>
      )} */}
    </div>
  );
};

export default SpinnerOverlay;
