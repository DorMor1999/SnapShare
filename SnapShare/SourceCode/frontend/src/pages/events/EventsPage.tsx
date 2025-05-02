import React, { Fragment, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';

//my imports
import MyButton from '../../shared/components/UI/Button/MyButton';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import { UserContext } from '../../context/UserContext';
import useHttpRequest from '../../hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';

// Sample event list
const eventList = [
  { id: '1', name: 'React Conference', date: '2025-05-15', isOwner: true },
  { id: '2', name: 'Tech Meetup', date: '2025-06-01', isOwner: false },
  { id: '3', name: 'Startup Pitch Night', date: '2025-06-20', isOwner: false },
];

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

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <Wrapper>
        <Row className="justify-content-left">
          <Col xs={6}>
            <h1>Events</h1>
            <br/>
          </Col>
          <Col xs={6}>
            <div className='d-flex justify-content-end'>
              <MyButton
                text="New Event"
                type="button"
                variant="primary"
                size={'lg'}
              />
            </div>
          </Col>
          
          {data?.map((event) => (
            <Col key={event._id} md={12} lg={6} className="mb-3">
              <div className="p-3 border rounded shadow-sm d-flex justify-content-between">
                <div>
                  <h5>{event.name}</h5>
                  {event.isOwner ? (
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="primary"
                        id={`dropdown-${event._id}`}
                      >
                        Manage
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#">Edit</Dropdown.Item>
                        <Dropdown.Item href="#">View Attendees</Dropdown.Item>
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
                    {new Date(event.date).toLocaleDateString('en-GB')}
                  </p>
                  <p className="mb-0">
                    {new Date(event.date).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Wrapper>
    </Fragment>
  );
};

export default EventsPage;
