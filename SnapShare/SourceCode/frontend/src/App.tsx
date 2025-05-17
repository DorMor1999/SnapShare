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
import SendInvitationPage from './pages/SendInvitation/SendInvitation';

// context
import { UserContext } from './context/UserContext';

//my components
import NavBar from './shared/components/NavBar/NavBar';




function App() {
  const { isConnected } = useContext(UserContext);

  let routes;
  if (isConnected) {
    routes = (
      <Fragment>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/new" element={<NewEventPage />} />
        <Route path="/events/edit/:eventId" element={<EditEventPage />} />
        <Route path="/events/:eventId/send_invitation" element={<SendInvitationPage />} />
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
