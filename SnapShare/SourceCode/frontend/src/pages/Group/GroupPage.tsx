import React, { Fragment, useContext, useEffect } from 'react';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import { UserContext } from '../../context/UserContext';
import useHttpRequest from '../../hooks/useHttpRequest';
import { useNavigate, useParams } from 'react-router';
import { PhotoGroup } from '../../shared/types/PhotoGroup';
import { User } from '../../shared/types/User';
import { Photo } from '../../shared/types/Photos';
import { Accordion } from 'react-bootstrap';
import Gallery from '../../shared/components/Gallery/Gallery';
import UsersTable from './components/UsersTable';
import MyButton from '../../shared/components/UI/Button/MyButton';

interface ResponsePhotoGroups {
  photoGroup: PhotoGroup;
  users: User[];
  photos: Photo[];
}

interface ResponseOwners {
  owners: { _id: string }[];
}

const GroupPage: React.FC = () => {
  const { token, userId } = useContext(UserContext);
  const { eventId, groupId } = useParams();
  const navigate = useNavigate();
  const [isOwner, setIsOwner] = React.useState(false);

  // Separate hooks for each request
  const {
    data: ownersData,
    error: ownersError,
    loading: ownersLoading,
    sendRequest: sendOwnersRequest,
    clearError: clearOwnersError,
  } = useHttpRequest<ResponseOwners>();

  const {
    data: groupsData,
    error: groupsError,
    loading: groupsLoading,
    sendRequest: sendGroupsRequest,
    clearError: clearGroupsError,
  } = useHttpRequest<ResponsePhotoGroups[]>();

  // Fetch owners
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendOwnersRequest(
      `${API_URL}/events/${eventId}`,
      'GET',
      undefined,
      { Authorization: `Bearer ${token}` }
    );
  }, [token, eventId]);

  // Set isOwner when ownersData arrives
  useEffect(() => {
    if (ownersData && 'owners' in ownersData) {
      const match = ownersData.owners.some((owner) => owner._id === userId);
      setIsOwner(match);
    }
  }, [ownersData, userId]);

  // Fetch groups
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendGroupsRequest(
      `${API_URL}/events/${eventId}/photo-group`,
      'GET',
      undefined,
      { Authorization: `Bearer ${token}` }
    );
  }, [token, eventId]);

  // Delete group handler
  async function deleteGroup(groupId: string, eventId: string) {
    const API_URL = import.meta.env.VITE_API_URL;
    const { error } = await sendGroupsRequest(
      `${API_URL}/events/${eventId}/photo-group/${groupId}`,
      'DELETE',
      undefined,
      { Authorization: `Bearer ${token}` }
    );
    if (!error) {
      navigate(`/events/${eventId}/groups/all`);
    }
  }

  // Find the group
  let group = null;
  if (groupsData && Array.isArray(groupsData)) {
    group = groupsData.find((g) => g.photoGroup._id === groupId) || null;
  }

  // Render logic
  let content;
  if (ownersLoading || groupsLoading) {
    content = <SpinnerOverlay />;
  } else if (group) {
    content = (
      <Fragment>
        <h1>Group - {group.photoGroup.name}</h1>
        <br />
        {isOwner && (
          <Fragment>
            <MyButton
              type="button"
              size="lg"
              variant="primary"
              onClick={() =>
                navigate(`/events/${eventId}/groups/${groupId}/edit`)
              }
              text="Edit Group"
            />{' '}
            <MyButton
              type="button"
              size="lg"
              variant="danger"
              onClick={() => deleteGroup(groupId || '', eventId || '')}
              text="Delete Group"
            />
          </Fragment>
        )}
        <br />
        <br />
        <Accordion alwaysOpen>
          <Accordion.Item eventKey="users">
            <Accordion.Header>Users</Accordion.Header>
            <Accordion.Body>
              <UsersTable users={group.users} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="photos">
            <Accordion.Header>Photos</Accordion.Header>
            <Accordion.Body>
              <Gallery photos={group.photos} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Fragment>
    );
  } else {
    content = <h1>Group not found!</h1>;
  }

  return (
    <Fragment>
      {ownersError && <ErrorModal message={ownersError} onClose={clearOwnersError} />}
      {groupsError && <ErrorModal message={groupsError} onClose={clearGroupsError} />}
      <Wrapper>{content}</Wrapper>
    </Fragment>
  );
};

export default GroupPage;
