import React, { Fragment } from 'react';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import MyButton from '../../shared/components/UI/Button/MyButton';
import { useNavigate, useParams } from 'react-router';

const AllGroupsPage: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  return (
    <Fragment>
      {/* {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />} */}
      <Wrapper>
        <h1>All Groups</h1>
        <MyButton
          type="button"
          size="lg"
          variant="primary"
          onClick={() => navigate(`/events/${eventId}/groups/new`)}
          text="New Group"
        />
        <br />
        <br />
      </Wrapper>
    </Fragment>
  );
};

export default AllGroupsPage;
