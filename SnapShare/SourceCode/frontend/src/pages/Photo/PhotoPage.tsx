import React, { useContext } from 'react';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import { useParams } from 'react-router';
import { UserContext } from '../../context/UserContext';

const PhotoPage: React.FC = () => {
  const params = useParams();
  const eventId = params.eventId ?? '';
  const photoId = params.photoId ?? '';

  

  return (
    <Wrapper>
      <h1>Photo</h1>
    </Wrapper>
  );
};

export default PhotoPage;
