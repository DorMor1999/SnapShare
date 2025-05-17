import React from 'react';
import styles from './InvitationCard.module.css';

type InvitationCardProps = {
  eventName: string;
  eventDate: string;
  eventType: string;
  sentAt: string;
};

const InvitationCard: React.FC<InvitationCardProps> = ({
  eventName,
  eventDate,
  eventType,
  sentAt,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.leftSide}>
        <div>
          <strong>Event:</strong> {eventName}
        </div>
        <div>
          <strong>Date:</strong> {eventDate}
        </div>
        <div>
          <strong>Type:</strong> {eventType}
        </div>
      </div>
      <div className={styles.rightSide}>
        <div className={styles.sentAt}>Sent at: {sentAt}</div>
        <div className={styles.buttonGroup}>
          <button className={`${styles.btn} ${styles.accept}`}>Accept</button>
          <button className={`${styles.btn} ${styles.decline}`}>Decline</button>
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
