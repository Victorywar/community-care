import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ReceiverDashboard from './pages/receiver/ReceiverDashboard';
import Logo from './components/common/Logo';

function SplashScreen() {
  return (
    <div className="min-h-screen w-full bg-[#080d1d] flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
      {/* App Logo */}
      <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-5 animate-pulse">
        <Logo size="lg" inverted={true} />
      </div>

      {/* App Name */}
      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
        Community<span className="text-blue-500">Care</span>
      </h1>
      <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-1">
        Relief & Dispatch Engine
      </p>

      {/* Loading Animation */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-[11px] text-slate-400 tracking-wider">Starting environment...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { currentUser, logout } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // ஆப் திறந்ததும் 1.8 வினாடிகள் Splash Screen காட்டி விட்டு அடுத்த திரைக்கு செல்லும்
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!currentUser) {
    return <Login />;
  }

  const role = (currentUser.role || '').toLowerCase();

  return (
    <DashboardLayout currentUser={currentUser} onLogout={logout}>
      {role === 'receiver' ? <ReceiverDashboard /> : <AdminDashboard />}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}