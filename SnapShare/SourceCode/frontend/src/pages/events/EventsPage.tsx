import React, { Fragment, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

//my imports
import MyButton from '../../shared/components/UI/Button/MyButton';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import { UserContext } from '../../context/UserContext';
import useHttpRequest from '../../hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';

type Event = {
  _id: string;
  name: string;
  date: string; // ISO 8601 date string
  owners: string[]; // Array of owner IDs
  participants: string[]; // Array of participant IDs
  photoGroups: any[]; // This could be a more specific type if you have details about photo groups
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  __v: number; // Version key for MongoDB
  isOwner: boolean; // Boolean flag indicating if the current user is the owner
};

type EventsResponse = Event[];

const EventsPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Get the query parameters, and set default values if they are not present
  const orderBy: string = searchParams.get('orderBy') || 'desc';
  const sortBy: string = searchParams.get('sortBy') || 'date';

  const { userId, token } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<EventsResponse>();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendRequest(
      `${API_URL}/events/user/${userId}?sortBy=${sortBy}&orderBy=${orderBy}`,
      'GET',
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
  }, [token, userId]);

  let content;
  if (data && data.length > 0) {
    content = data?.map((event) => (
      <Col key={event._id} md={12} lg={6} className="mb-3">
        <div className="p-3 border rounded shadow-sm d-flex justify-content-between">
          <div>
            <h5>{event.name}</h5>
            {event.isOwner ? (
              <Dropdown>
                <Dropdown.Toggle variant="primary" id={`dropdown-${event._id}`}>
                  Manage
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href={`/events/edit/${event._id}`}>
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item href="#">My Photos</Dropdown.Item>
                  <Dropdown.Item href="#">All Photos</Dropdown.Item>
                  <Dropdown.Item href="#">
                    Owners and Participants
                  </Dropdown.Item>
                  <Dropdown.Item href="#">Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <MyButton
                text="View"
                type="button"
                variant="primary"
                size={undefined}
              />
            )}
          </div>
          <div className="d-flex flex-column align-items-end">
            <p className="mb-0">
              {new Date(event.date).toLocaleDateString('en-GB', {
                timeZone: 'UTC', // ⬅️ This ensures the date is also UTC-based
              })}
            </p>
            <p className="mb-0">
              {new Date(event.date).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'UTC', // ⬅️ This forces UTC
              })}
            </p>
          </div>
        </div>
      </Col>
    ));
  } else {
    content = <h4>You have 0 events!</h4>;
  }

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <Wrapper>
        <Row className="justify-content-left">
          <Col xs={6}>
            <h1>Events</h1>
          </Col>
          <Col xs={6}>
            <div className="d-flex flex-column align-items-end">
              <MyButton
                text="New Event"
                type="button"
                variant="primary"
                size={'lg'}
                link="/events/new"
              />
              <DropdownButton
                id="dropdown-basic-button"
                title="Sort"
                size={'lg'}
                variant="secondary"
                className="mt-2"
              >
                <Dropdown.Item
                  active={sortBy === 'date' && orderBy === 'desc'}
                  href="/events?sortBy=date&orderBy=desc"
                >
                  Date Descending
                </Dropdown.Item>
                <Dropdown.Item
                  active={sortBy === 'date' && orderBy === 'asc'}
                  href="/events?sortBy=date&orderBy=asc"
                >
                  Date Ascending
                </Dropdown.Item>
                <Dropdown.Item
                  active={sortBy === 'name' && orderBy === 'desc'}
                  href="/events?sortBy=name&orderBy=desc"
                >
                  Name Descending
                </Dropdown.Item>
                <Dropdown.Item
                  active={sortBy === 'name' && orderBy === 'asc'}
                  href="/events?sortBy=name&orderBy=asc"
                >
                  Name Ascending
                </Dropdown.Item>
              </DropdownButton>
            </div>
            <br />
          </Col>
          {content}
        </Row>
      </Wrapper>
    </Fragment>
  );
};

export default EventsPage;
