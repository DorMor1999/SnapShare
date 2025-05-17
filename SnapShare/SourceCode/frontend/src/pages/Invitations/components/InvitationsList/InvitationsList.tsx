import React, { Fragment, useContext, useEffect, useState } from 'react';

import { UserContext } from '../../../../context/UserContext';
import useHttpRequest from '../../../../hooks/useHttpRequest';
import { InvitationType } from '../../../../shared/types/InvitationType';
import { InvitationStatus } from '../../../../shared/types/InvitationStatus ';
import ErrorModal from '../../../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../../../shared/components/UI/Spinner/SpinnerOverlay';
import InvitationCard from '../InvitationCard/InvitationCard';

interface InvitationsTableProps {
  userEmail: string | undefined;
}

interface EventResponse {
  _id: string;
  name: string;
  date: string; // ISO string
  owners: string[];
  participants: string[];
  photoGroups: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface InvitationResponse {
  _id: string;
  eventId: EventResponse; // updated from string to EventResponse
  email: string;
  firstName: string;
  lastName: string;
  type: 'OWNER' | 'PARTICIPANT';
  status: 'ACCEPTED' | 'PENDING' | 'DECLINED';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  id: string;
}

type InvitationsResponse = InvitationResponse[];

const InvitationsList: React.FC<InvitationsTableProps> = ({ userEmail }) => {
  const { token } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<InvitationsResponse>();

  useEffect(() => {
    if (userEmail) {
      const API_URL = import.meta.env.VITE_API_URL;

      sendRequest(
        `${API_URL}/invitations/email/${userEmail}?filterBy=PENDING`,
        'GET',
        undefined,
        {
          Authorization: `Bearer ${token}`,
        }
      );
    }
  }, [token, userEmail]);

  let content;
  if (data && data.length > 0){
    content = (data.map((invitation) => (
            <InvitationCard
              key={invitation._id}
              eventDate={invitation.eventId.date}
              eventName={invitation.eventId.name}
              invitationType={invitation.type}
              sentAt={invitation.createdAt}
              invitationId={invitation._id}
            />
          )))
  }
  else{
    content = (<h3>You have 0 invitations!</h3>);
  }

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <br />
      <div>
        {content}
      </div>
    </Fragment>
  );
};

export default InvitationsList;
