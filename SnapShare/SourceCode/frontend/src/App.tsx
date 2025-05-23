//depencies
import { Fragment, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//pages
import HomePage from './pages/home/HomePage';
import EventsPage from './pages/events/EventsPage';
import LogInPage from './pages/login/LogInPage';
import RagisterPage from './pages/register/RagisterPage';
import NewEventPage from './pages/NewEvent/NewEventPage';
import EditEventPage from './pages/EditEvent/EditEventPage';
import SendInvitationPage from './pages/SendInvitation/SendInvitationPage';
import SendInvitationsPage from './pages/SendInvitations/SendInvitationsPage';
import InvitationsPage from './pages/Invitations/InvitationsPage';
import OwnersParticipantsInvitationsPage from './pages/OwnersParticipantsInvitations/OwnersParticipantsInvitationsPage';

// context
import { UserContext } from './context/UserContext';

//my components
import NavBar from './shared/components/NavBar/NavBar';
import UploadPhotosPage from './pages/UploadPhotos/UploadPhotosPage';




function App() {
  const { isConnected } = useContext(UserContext);

  let routes;
  if (isConnected) {
    routes = (
      <Fragment>
        <Route path="/" element={<HomePage />} />
        <Route path="/invitations" element={<InvitationsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/new" element={<NewEventPage />} />
        <Route path="/events/:eventId/edit" element={<EditEventPage />} />
        <Route path="/events/:eventId/send_invitations" element={<SendInvitationsPage />} />
        <Route path="/events/:eventId/send_invitation" element={<SendInvitationPage />} />
        <Route path="/events/:eventId/owners_participants_invitations" element={<OwnersParticipantsInvitationsPage />} />
        <Route path="/events/:eventId/upload_photos" element={<UploadPhotosPage />} />
        <Route path="*" element={<HomePage />} />
      </Fragment>
    );
  }
  else{
    routes = (
      <Fragment>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LogInPage/>} />
        <Route path="/register" element={<RagisterPage />} />
        <Route path="*" element={<HomePage />} />
      </Fragment>
    );
  }

  return (
    <Router>
      <NavBar />
      <Routes>
        {routes}
      </Routes>
    </Router>
  );
}

export default App;
