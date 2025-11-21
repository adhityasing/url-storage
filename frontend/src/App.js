import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="container">
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              <h1>TinyLink</h1>
            </Link>
            <nav>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            </nav>
          </div>
        </header>
        <main className="app-main">
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard apiUrl={API_BASE_URL} />} />
              <Route path="/code/:code" element={<Stats apiUrl={API_BASE_URL} />} />
            </Routes>
          </div>
        </main>
        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2024 TinyLink. URL Shortener Service.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

