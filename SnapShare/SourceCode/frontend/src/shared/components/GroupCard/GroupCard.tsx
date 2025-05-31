import React from 'react';
import { Card } from 'react-bootstrap';
import { PhotoGroup } from '../../types/PhotoGroup';
import styles from './GroupCard.module.css';
import MyButton from '../UI/Button/MyButton';
import { useNavigate, useParams } from 'react-router';

interface Props {
  photoGroup: PhotoGroup;
}

const GroupCard: React.FC<Props> = ({ photoGroup }) => {
  const { _id, name, userIds, createdAt } = photoGroup;
  const { eventId } = useParams();
  const navigate = useNavigate();
  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          <strong>Users:</strong> {userIds.length} <br />
          <strong>Created At:</strong>{' '}
          {new Date(createdAt).toLocaleDateString('en-GB', {
            timeZone: 'UTC', // ⬅️ This ensures the date is also UTC-based
          })}{' '}
          {new Date(createdAt).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </Card.Text>
        <div className="d-grid gap-5">
          <MyButton
            text="View"
            size={'lg'}
            variant={'primary'}
            type="button"
            onClick={() => navigate(`/events/${eventId}/groups/${_id}`)}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default GroupCard;
