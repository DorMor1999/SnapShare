import React, { Fragment, useContext } from 'react';
import styles from './InvitationCard.module.css';
import useHttpRequest from '../../../../hooks/useHttpRequest';
import ErrorModal from '../../../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../../../shared/components/UI/Spinner/SpinnerOverlay';
import { UserContext } from '../../../../context/UserContext';
import { InvitationType } from '../../../../shared/types/InvitationType';

type InvitationCardProps = {
  eventName: string;
  eventDate: string;
  invitationType: InvitationType;
  sentAt: string;
  invitationId: string;
};

const InvitationCard: React.FC<InvitationCardProps> = ({
  eventName,
  eventDate,
  invitationType,
  sentAt,
  invitationId,
}) => {
  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<any>();

  const { token } = useContext(UserContext);

  async function sendRequestDecline() {
    const API_URL = import.meta.env.VITE_API_URL;
    let url: string = `${API_URL}/invitations/${invitationId}`;

    const { error } = await sendRequest(
      url,
      'PUT',
      { status: 'DECLINED' },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!error) {
      window.location.reload();
    }
  }

  async function sendRequestAccept() {
    const API_URL = import.meta.env.VITE_API_URL;
    let url: string = `${API_URL}/invitations/${invitationId}/accept`;

    const { error } = await sendRequest(url, 'POST', undefined, {
      Authorization: `Bearer ${token}`,
    });

    if (!error) {
      window.location.reload();
    }
  }

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <div className={styles.card}>
        <div className={styles.leftSide}>
          <div>
            <strong>Event:</strong> {eventName}
          </div>
          <div>
            <strong>Date:</strong>{' '}
            {new Date(eventDate).toLocaleDateString('en-GB', {
              timeZone: 'UTC', // ⬅️ This ensures the date is also UTC-based
            })}{' '}
            {new Date(eventDate).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              timeZone: 'UTC', // ⬅️ This forces UTC
            })}
          </div>
          <div>
            <strong>Type:</strong> {invitationType}
          </div>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.sentAt}>
            Sent at:{' '}
            {new Date(sentAt).toLocaleDateString('en-GB', {
              timeZone: 'UTC', // ⬅️ This ensures the date is also UTC-based
            })}{' '}
            {new Date(sentAt).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              timeZone: 'UTC', // ⬅️ This forces UTC
            })}
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.btn} ${styles.accept}`}
              onClick={() => sendRequestAccept()}
            >
              Accept
            </button>
            <button
              className={`${styles.btn} ${styles.decline}`}
              onClick={() => sendRequestDecline()}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default InvitationCard;
