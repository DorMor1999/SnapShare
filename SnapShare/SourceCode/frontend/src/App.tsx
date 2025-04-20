//depencies
import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';

//pages
import HomePage from './pages/home/HomePage';
import EventsPage from './pages/events/EventsPage';
import LogInPage from './pages/login/LogInPage';
import RagisterPage from './pages/register/RagisterPage';


//my components
import NavBar from './shared/components/NavBar/NavBar';

function App() {
  const isConnected: boolean = true;

  let routes;
  if (isConnected) {
    routes = (
      <Fragment>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
      </Fragment>
    );
  }
  else{
    routes = (
      <Fragment>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LogInPage/>} />
        <Route path="/register" element={<RagisterPage />} />
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
