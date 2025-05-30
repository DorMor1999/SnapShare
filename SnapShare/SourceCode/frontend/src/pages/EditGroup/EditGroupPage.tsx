import React, { Fragment, useContext, useEffect } from 'react';
import GroupForm from '../../shared/components/GroupForm/GroupForm';
import { useParams } from 'react-router';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import useHttpRequest from '../../hooks/useHttpRequest';
import { UserContext } from '../../context/UserContext';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotosUrls: string[][];
};

type Group = {
  _id: string;
  eventId: string;
  name: string;
  userIds: User[];
};

type Response = Group;

const EditGroupPage: React.FC = () => {
  const { groupId, eventId } = useParams();
  const { token } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<Response>();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendRequest(`${API_URL}/events/${eventId}/photo-group/${groupId}`, 'GET', undefined, {
      Authorization: `Bearer ${token}`,
    });
  }, [token, groupId, eventId]);

  

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <GroupForm formType="Edit Group" groupName={data?.name} groupId={groupId} />
    </Fragment>
  );
};

export default EditGroupPage;
