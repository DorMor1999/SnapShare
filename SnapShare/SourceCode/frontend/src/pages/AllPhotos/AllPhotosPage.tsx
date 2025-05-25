import React from 'react';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import MyButton from '../../shared/components/UI/Button/MyButton';
import { useNavigate, useParams } from 'react-router';

const AllPhotosPage: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  function moveToOtherPage(path: string): void {
    navigate(`${path}`);
  }
  return (
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
    </Wrapper>
  );
};

export default AllPhotosPage;
