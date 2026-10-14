import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import LoginPage from './pages/auth/LoginPage';
import DonorDashboard from './pages/donor/DonorDashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import RecipientDashboard from './pages/recipient/RecipientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { api } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [notifications, setNotifications] = useState([]);

  const refreshNotifs = async () => {
    if (!currentUser) return;
    try {
      const list = await api.getNotifications(currentUser.role);
      setNotifications(Array.isArray(list) ? list : []);
    } catch {}
  };

  useEffect(() => {
    refreshNotifs();
    const interval = setInterval(refreshNotifs, 10000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('cc_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('cc_user');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Admin Verification Gate
  if (currentUser.accountStatus === 'PENDING_APPROVAL') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-black text-slate-900">Verification Pending</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your account is currently awaiting admin verification. You will be notified once your account is approved.
          </p>
          <button onClick={handleLogout} className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-slate-800">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <main className="flex-1">
        {currentUser.role === 'ADMIN' && <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />}
        {currentUser.role === 'DONOR' && <DonorDashboard currentUser={currentUser} onLogout={handleLogout} />}
        {currentUser.role === 'VOLUNTEER' && <VolunteerDashboard currentUser={currentUser} onLogout={handleLogout} />}
        {(currentUser.role === 'RECIPIENT' || currentUser.role === 'RECEIVER') && (
          <RecipientDashboard currentUser={currentUser} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}