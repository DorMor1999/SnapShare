import React, { Fragment, useContext, useEffect } from 'react';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import { useParams } from 'react-router';
import { UserContext } from '../../context/UserContext';
import useHttpRequest from '../../hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import { Image } from 'react-bootstrap';
import TagTable from './components/TagTable';
import { downloadPhoto } from './util/downloadPhoto';
import MyButton from '../../shared/components/UI/Button/MyButton';

interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotosUrls: string[][];
}

interface PopulatedPhotoResponse {
  _id: string;
  eventId: string;
  url: string;
  photoGroups: any[]; // You can replace 'any' with a proper type if needed
  userIds: PopulatedUser[];
  uploadedAt: string; // or `Date` if you parse it
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const PhotoPage: React.FC = () => {
  const params = useParams();
  const eventId = params.eventId ?? '';
  const photoId = params.photoId ?? '';
  const { token } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<PopulatedPhotoResponse>();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendRequest(
      `${API_URL}/events/${eventId}/photos/${photoId}`,
      'GET',
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
  }, [token, eventId]);

  let content;
  if (data) {
    content = (<Fragment>
        <br/>
        <MyButton onClick={() => downloadPhoto(data.url, photoId)} variant={'primary'} size='lg' type='button' text='Download Photo'/>
        <br/>
        <br/>
        <Image src={data.url} alt={`Photo ${photoId}`} fluid rounded className="mb-3" />
        <br/>
        <TagTable users={data.userIds}/>
    </Fragment>);
  } else {
    content = <h2>Photo not found!</h2>;
  }

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <Wrapper>
        <h1>Photo</h1>
        {content}
      </Wrapper>
    </Fragment>
  );
};

export default PhotoPage;
