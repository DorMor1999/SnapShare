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
import AllPhotosPage from './pages/AllPhotos/AllPhotosPage';
import MyPhotosPage from './pages/MyPhotos/MyPhotosPage';
import PhotoPage from './pages/Photo/PhotoPage';
import AddTagPage from './pages/AddTag/AddTagPage';
import AllGroupsPage from './pages/AllGroups/AllGroupsPage';
import NewGroupPage from './pages/NewGroup/NewGroupPage';
import EditGroupPage from './pages/EditGroup/EditGroupPage';
import GroupPage from './pages/Group/GroupPage';
import MyGroupsPage from './pages/MyGroups/MyGroupsPage';




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
        <Route path="/events/:eventId/all_photos" element={<AllPhotosPage />} />
        <Route path="/events/:eventId/my_photos" element={<MyPhotosPage />} />
        <Route path="/events/:eventId/photos/:photoId" element={<PhotoPage />} />
        <Route path="/events/:eventId/photos/:photoId/add_tag" element={<AddTagPage />} />
        <Route path="/events/:eventId/groups/all" element={<AllGroupsPage />} />
        <Route path="/events/:eventId/groups/my" element={<MyGroupsPage />} />
        <Route path="/events/:eventId/groups/new" element={<NewGroupPage />} />
        <Route path="/events/:eventId/groups/:groupId/edit" element={<EditGroupPage />} />
        <Route path="/events/:eventId/groups/:groupId" element={<GroupPage />} />
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
