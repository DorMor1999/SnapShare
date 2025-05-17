import React, { Fragment, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { UserContext } from '../../../../../context/UserContext';
import useHttpRequest from '../../../../../hooks/useHttpRequest';
import { InvitationType } from '../../../../types/InvitationType';
import { InvitationStatus } from '../../../../types/InvitationStatus ';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import classes from './NavLinkInvitations.module.css';
import ErrorModal from '../../../UI/Modal/ErrorModal';
import SpinnerOverlay from '../../../UI/Spinner/SpinnerOverlay';


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

interface NavLinkInvitationsProps {
  userEmail: string | undefined;
}

const NavLinkInvitations: React.FC<NavLinkInvitationsProps> = ({
  userEmail,
}) => {
  const navigate = useNavigate();
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

  function moveToOtherPage(path: string): void {
    navigate(`${path}`);
  }

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <Nav.Link onClick={() => moveToOtherPage("/invitations")}>
        Invitations{' '}
        {data && data?.length > 0 && (
          <Badge className={classes['invitations-badge']} pill bg="danger">
            {data.length}
          </Badge>
        )}
      </Nav.Link>
    </Fragment>
  );
};

export default NavLinkInvitations;
