import React, { Fragment, useContext, useEffect } from 'react';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import MyButton from '../../shared/components/UI/Button/MyButton';
import { useNavigate, useParams } from 'react-router';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import useHttpRequest from '../../hooks/useHttpRequest';
import { UserContext } from '../../context/UserContext';
import { PhotoArray } from '../../shared/types/Photos';
import Gallery from '../../shared/components/Gallery/Gallery';


type PhotoArrayResponse = PhotoArray;

const AllPhotosPage: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<PhotoArrayResponse>();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendRequest(`${API_URL}/events/${eventId}/photos`, 'GET', undefined, {
      Authorization: `Bearer ${token}`,
    });
  }, [token, eventId]);

  function moveToOtherPage(path: string): void {
    navigate(`${path}`);
  }

  let content;
  if (data && data.length > 0) {
    content = (<Gallery isOwner={true} photos={data}/>);
  } else {
    content = <h2>No photos found in this event!</h2>;
  }

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <Wrapper>
        <h1>All Photos</h1>
        <MyButton
          type="button"
          size="lg"
          variant="primary"
          onClick={() => moveToOtherPage(`/events/${eventId}/upload_photos`)}
          text="Upload Photos"
        />
        <br />
        <br />
        {content}
      </Wrapper>
    </Fragment>
  );
};

export default AllPhotosPage;
