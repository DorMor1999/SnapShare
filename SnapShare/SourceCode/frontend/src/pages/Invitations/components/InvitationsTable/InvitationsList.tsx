import React, { Fragment, useContext, useEffect, useState } from 'react';

import { UserContext } from '../../../../context/UserContext';
import useHttpRequest from '../../../../hooks/useHttpRequest';
import { InvitationType } from '../../../../shared/types/InvitationType';
import { InvitationStatus } from '../../../../shared/types/InvitationStatus ';
import ErrorModal from '../../../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../../../shared/components/UI/Spinner/SpinnerOverlay';
import Table from 'react-bootstrap/Table';
import MyButton from '../../../../shared/components/UI/Button/MyButton';
import classes from './InvitationsTable.module.css';

interface InvitationsTableProps {
  userEmail: string | undefined;
}

type Invitation = {
  id: number;
  eventName: string;
  invitationType: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined';
};

const sampleInvitations: Invitation[] = [
  {
    id: 1,
    eventName: 'React Conference 2025',
    invitationType: 'Online',
    sentAt: '2025-05-15',
    status: 'pending',
  },
  {
    id: 2,
    eventName: 'Tech Meetup',
    invitationType: 'In-Person',
    sentAt: '2025-05-10',
    status: 'pending',
  },
];

interface InvitationResponse {
  _id: string;
  eventId: string;
  email: string;
  firstName: string;
  lastName: string;
  type: InvitationType;
  status: InvitationStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  id: string;
}

type InvitationsResponse = InvitationResponse[];

const InvitationsList: React.FC<InvitationsTableProps> = ({ userEmail }) => {
  const [invitations, setInvitations] =
    useState<Invitation[]>(sampleInvitations);
  const { token } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<InvitationsResponse>();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    sendRequest(
      `${API_URL}/invitations/email/${userEmail}?filterBy=PENDING`,
      'GET',
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
  }, [token, userEmail]);

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <br />

      
    </Fragment>
  );
};

export default InvitationsList;
