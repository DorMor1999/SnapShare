//depencies
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';

//pages
import HomePage from './pages/home/HomePage';
import EventsPage from './pages/events/EventsPage';

// components
import NavBar from './shared/components/NavBar/NavBar';
import LogInPage from './pages/login/LogInPage';

function App() {
  const isConnected: boolean = false;

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
        <Route path="/register" element={<EventsPage />} />
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
