import React, { Fragment, useContext, useEffect } from 'react';
import { InvitationType } from '../../../../shared/types/InvitationType';
import Table from 'react-bootstrap/Table';
import { useParams } from 'react-router';
import { UserContext } from '../../../../context/UserContext';
import useHttpRequest from '../../../../hooks/useHttpRequest';
import ErrorModal from '../../../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../../../shared/components/UI/Spinner/SpinnerOverlay';
import styles from './InvitationsTable.module.css';
import { InvitationStatus } from '../../../../shared/types/InvitationStatus ';
import MyButton from '../../../../shared/components/UI/Button/MyButton';

type InvitationResponse = {
  _id: string;
  eventId: string;
  email: string;
  firstName: string;
  lastName: string;
  type: InvitationType;
  status: InvitationStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

type responseType = InvitationResponse[];

const InvitationsTable: React.FC = () => {
  const { eventId } = useParams();

  const { token } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<responseType>();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendRequest(`${API_URL}/invitations/event/${eventId}`, 'GET', undefined, {
      Authorization: `Bearer ${token}`,
    });
  }, [token, eventId]);

  let content;
  if (data && data.length > 0) {
    content = (
      <div className={styles.scrollableTable}>
        <Table striped hover size={'sm'}>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>status</th>
              <th>Sent At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((invitation, index) => (
              <tr key={invitation._id}>
                <td>{index + 1}</td>
                <td>{invitation.firstName}</td>
                <td>{invitation.lastName}</td>
                <td>{invitation.email}</td>
                <td>{invitation.type}</td>
                <td
                  className={
                    invitation.status === 'ACCEPTED'
                      ? styles['ACCEPTED']
                      : invitation.status === 'DECLINED'
                      ? styles['DECLINED']
                      : ''
                  }
                >
                  {invitation.status}
                </td>
                <td>
                  {new Date(invitation.createdAt).toLocaleDateString('en-GB', {
                    timeZone: 'UTC', // ⬅️ This ensures the date is also UTC-based
                  })}{' '}
                  {new Date(invitation.createdAt).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  } else {
    content = <h2>No invitations for found this event!</h2>;
  }

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <MyButton
        size={"lg"}
        text="Send Invitation"
        type="button"
        link={`/events/${eventId}/send_invitation`}
        variant="outline-primary"
      />{' '}
      {}
      <MyButton
        size={"lg"}
        text="Send Invitations"
        type="button"
        link={`/events/${eventId}/send_invitations`}
        variant="success"
      />
      <br />
      <br/>
      {content}
    </Fragment>
  );
};

export default InvitationsTable;
