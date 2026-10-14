import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import AdminDashboard from './pages/admin/AdminDashboard';
import DonorDashboard from './pages/donor/DonorDashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import RecipientDashboard from './pages/recipient/RecipientDashboard';

function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 z-50">
      {/* Centered Professional Double-Ring Circular Emblem */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32 rounded-full border border-emerald-200/80 bg-gradient-to-b from-emerald-50/70 to-emerald-100/40 flex items-center justify-center shadow-lg p-5">
          <div className="w-full h-full rounded-full border border-dashed border-emerald-400/60 flex items-center justify-center p-3">
            <img 
              src="/logo.svg" 
              alt="Community Care" 
              className="w-full h-full object-contain drop-shadow-sm animate-pulse" 
            />
          </div>
        </div>
      </div>
      
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Community Care</h1>
      <p className="text-xs text-slate-500 font-medium mt-1">Autonomous Relief & Dispatch</p>
      
      <div className="w-64 max-w-full bg-slate-100 rounded-full h-1.5 mt-8 overflow-hidden">
        <div className="bg-slate-900 h-full rounded-full animate-[progress_1.8s_ease-in-out_infinite]" style={{ width: '85%' }}></div>
      </div>
      <div className="flex justify-between w-64 max-w-full text-[10px] text-slate-400 font-semibold mt-2">
        <span>Setting up dashboard...</span>
        <span>100%</span>
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cc_user');
    return saved ? JSON.parse(saved) : { name: 'Demo User', role: 'DONOR', email: 'donor@communitycare.org' };
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  const handleRoleChange = (role) => {
    const updated = { ...currentUser, role };
    setCurrentUser(updated);
    localStorage.setItem('cc_user', JSON.stringify(updated));
  };

  const handleLogout = () => {
    handleRoleChange('DONOR');
  };

  if (loading) {
    return <SplashScreen />;
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