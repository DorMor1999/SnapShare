import React, { Fragment, useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { UserContext } from '../../context/UserContext';
import useHttpRequest from '../../hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import GroupsList from '../../shared/components/GroupsList/GroupsList';
import { PhotoGroup } from '../../shared/types/PhotoGroup';

interface Response {
  photoGroup: PhotoGroup;
}

const MyGroupsPage: React.FC = () => {
  const { eventId } = useParams();

  const { token, userId } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<Response[]>();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendRequest(`${API_URL}/events/${eventId}/photo-group/user/${userId}`, 'GET', undefined, {
      Authorization: `Bearer ${token}`,
    });
  }, [token, eventId, userId]);

  

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <Wrapper>
        <h1>My Groups</h1>
        <br />
        <br />
        <GroupsList photoGroups={data ? data?.map((g) => g.photoGroup) : []}/>
      </Wrapper>
    </Fragment>
  );
};

export default MyGroupsPage;