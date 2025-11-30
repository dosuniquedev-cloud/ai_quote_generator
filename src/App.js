import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Home from './Home';
import History from './History';

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-dark text-white">

        {/* Navigation Bar */}
        <nav className="navbar navbar-expand navbar-dark bg-black shadow-sm mb-4">
          <div className="container">
            <Link className="navbar-brand fw-bold text-warning" to="/">AI Quotes</Link>
            <div className="navbar-nav ms-auto">
              <Link className="nav-link" to="/">Home</Link>
              <Link className="nav-link" to="/history">History</Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;