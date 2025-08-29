import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import CheckIn from '../pages/CheckIn';
import CheckOut from '../pages/CheckOut';
const AppRoutes = () => {
  return (
    <div className="main-content" style={{ flex: 1, padding: '20px' }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/checkout" element={<CheckOut />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;