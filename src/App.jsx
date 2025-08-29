import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AppRoutes from './components/AppRoutes'
import './styles/main.scss';
import './styles/navbar.scss';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Router>
      <div className="app-container">
        <div className="content">
          <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
          <AppRoutes />
        </div>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
