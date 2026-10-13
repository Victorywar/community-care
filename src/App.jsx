import React, { useState, useEffect } from 'react';
import LoginModal from './components/auth/LoginModal';
import DashboardLayout from './components/layout/DashboardLayout';
import RecipientDashboard from './pages/recipient/RecipientDashboard';
import DonorDashboard from './pages/donor/DonorDashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('cc_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cc_user');
    localStorage.removeItem('cc_token');
  };

  if (!currentUser) {
    return <LoginModal onLogin={handleLogin} />;
  }

  const role = (currentUser.role || 'RECIPIENT').toUpperCase();

  switch (role) {
    case 'ADMIN':
      return <DashboardLayout currentUser={currentUser} onLogout={handleLogout} />;
    case 'DONOR':
      return <DonorDashboard currentUser={currentUser} onLogout={handleLogout} />;
    case 'VOLUNTEER':
      return <VolunteerDashboard currentUser={currentUser} onLogout={handleLogout} />;
    case 'RECIPIENT':
    case 'RECEIVER':
    default:
      return <RecipientDashboard currentUser={currentUser} onLogout={handleLogout} />;
  }
}