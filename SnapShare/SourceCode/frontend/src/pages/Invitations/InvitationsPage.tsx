import React, { Fragment, useContext, useEffect } from 'react';

import { UserContext } from '../../context/UserContext';
import useHttpRequest from '../../hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import InvitationsList from './components/InvitationsList/InvitationsList';

type UserProfile = {
  email: string;
  firstName: string;
  lastName: string;
  password: string; // Ideally, this would be hashed in your backend and not exposed
  phoneNumber: string;
  profilePhotosEncoding: number[]; // Array of numbers representing the profile photo encoding
  profilePhotosUrls: string[]; // Array of URLs for profile photos
};

const InvitationsPage: React.FC = () => {
  const { userId, token } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<UserProfile>();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    sendRequest(`${API_URL}/users/${userId}`, 'GET', undefined, {
      Authorization: `Bearer ${token}`,
    });
  }, [token, userId]);

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <Wrapper>
        <h1>Invitations</h1>
        <InvitationsList userEmail={data?.email} />
      </Wrapper>
    </Fragment>
  );
};

export default InvitationsPage;
