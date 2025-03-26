//depencies
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';

//pages
import HomePage from './pages/home/HomePage';
import EventsPage from './pages/events/EventsPage';


// components
import NavBar from './shared/components/NavBar/NavBar';

function App() {
  

  return (
    <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          {/* <Route path="/series" element={<SeriesPage />} />
          <Route path="/movies/:itemId" element={<MoviePage />} />
          <Route path="/series/:itemId" element={<SpecificSeriesPage />} /> */}
        </Routes>
      
    </Router>
  );
}

export default App
