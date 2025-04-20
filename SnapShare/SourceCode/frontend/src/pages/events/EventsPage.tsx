import React from 'react';

// Bootstrap imports
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';

//my imports
import MyButton from '../../shared/components/UI/Button/MyButton';


// Sample event list
const eventList = [
  { id: '1', name: 'React Conference', date: '2025-05-15', isOwner: true },
  { id: '2', name: 'Tech Meetup', date: '2025-06-01', isOwner: false },
  { id: '3', name: 'Startup Pitch Night', date: '2025-06-20', isOwner: false },
];

const EventsPage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-left">
        <Col md={6}>
        <h1>Events</h1>
        </Col>
        <Col md={6}>
          <MyButton text='New Event' type="button" variant="primary" size={undefined}/>
        </Col>

        {eventList.map(event => (
          <Col key={event.id} md={12} lg={6} className="mb-3">
            <div className="p-3 border rounded shadow-sm">
              <h5>{event.name}</h5>
              <p>{event.date}</p>
              {event.isOwner ? (
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id={`dropdown-${event.id}`}>
                    Manage
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#">Edit</Dropdown.Item>
                    <Dropdown.Item href="#">View Attendees</Dropdown.Item>
                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <MyButton text='View' type="button" variant="primary" size={undefined}/>
              )}
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default EventsPage;
