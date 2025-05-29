import React, { Fragment, useContext, useEffect, useState } from 'react';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import { useNavigate, useParams } from 'react-router';
import { UserContext } from '../../context/UserContext';
import useHttpRequest from '../../hooks/useHttpRequest';
import Gallery from '../../shared/components/Gallery/Gallery';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import { Button, ButtonGroup } from 'react-bootstrap';
import { PhotoPositionType } from '../../shared/types/Photos';

type UserPosition = {
  userId: string;
  position: PhotoPositionType; // e.g., "Close (Main Subject)", "Background"
};

type EventPhoto = {
  _id: string;
  eventId: string;
  url: string;
  photoGroups: any[]; // If you know the structure, replace `any` with the proper type
  userIds: string[];
  uploadedAt: string; // ISO date string
  __v: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userPositions: UserPosition[];
};

type EventPhotoResponse = EventPhoto[];

const MyPhotosPage: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [position, setPosition] = useState<PhotoPositionType>(
    'Close (Main Subject)'
  );
  const { token, userId } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<EventPhotoResponse>();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendRequest(
      `${API_URL}/events/${eventId}/user-photos/${userId}`,
      'GET',
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
  }, [userId, token, eventId]);

  // Filter photos whenever `data` or `position` changes
  useEffect(() => {
    if (data && data.length > 0) {
      const filtered = data.filter((photo) =>
        photo.userPositions.some((pos) => pos.position === position)
      );
      setPhotos(filtered);
    } else {
      setPhotos([]);
    }
  }, [data, position]);

  let content;
  if (photos.length > 0) {
    content = <Gallery photos={photos} />;
  } else if (!loading) {
    content = <h2>No photos found in this event!</h2>;
  }

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <Wrapper>
        <h1>My Photos</h1>
        <ButtonGroup>
          <Button
            variant={
              position === 'Close (Main Subject)'
                ? 'primary'
                : 'outline-primary'
            }
            onClick={() => setPosition('Close (Main Subject)')}
          >
            Close
          </Button>
          <Button
            variant={position === 'Background' ? 'primary' : 'outline-primary'}
            onClick={() => setPosition('Background')}
          >
            Background
          </Button>
        </ButtonGroup>
        <br />
        <br />
        {content}
      </Wrapper>
    </Fragment>
  );
};

export default MyPhotosPage;
