import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { TicketProvider } from './context/TicketContext';
import './index.css';

function AppLayout() {
  const location = useLocation();

  return (
    <div className="layout-container">
      <div className="bg-orb-1"></div>
      <div className="bg-orb-2"></div>

      <Sidebar />
      <main className="main-content">
        <header className="flex-between" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 className="animate-fade-in" style={{ fontSize: '1.875rem' }}>
              {location.pathname === '/' ? 'Ticketing Dashboard' : 'Ticket Management'}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Overview of all IT support requests.</p>
          </div>
          <div className="flex-between" style={{ gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>TA</div>
              <span>Raisul. Admin</span>
            </div>
          </div>
        </header>

        <div className="animate-fade-in glass-panel" style={{ padding: '1.5rem', minHeight: 'calc(100vh - 150px)' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Future routes could go here */}
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <TicketProvider>
      <Router>
        <AppLayout />
      </Router>
    </TicketProvider>
  );
}

export default App;
