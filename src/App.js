import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Home from './Home';
import History from './History';
import Privacy from './Privacy';

function App() {
  return (
    <Router>

      <div className="min-vh-100 bg-dark text-white d-flex flex-column">

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


        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </div>


        <footer className="text-center py-3 text-white-50 mt-auto">
          <small>
            &copy; 2025{' '}
            <Link to="/privacy" className="text-white-50 text-decoration-none fw-bold">
              DOS AI Quote Generator
            </Link>
            .<br />
            <Link to="/privacy" className=" text-decoration-none">
              Privacy Policy
            </Link>
          </small>
        </footer>

      </div>
    </Router>
  );
}

export default App;
