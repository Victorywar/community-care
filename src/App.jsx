import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import RecipientDashboard from './pages/recipient/RecipientDashboard';
import DonorDashboard from './pages/donor/DonorDashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import { ShieldCheck } from 'lucide-react';

function SplashScreen() {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + 18, 100);
      });
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-white flex flex-col justify-between items-center px-6 py-8 select-none z-50">
      <div className="h-4"></div>
      <div className="flex flex-col items-center max-w-xs w-full">
        <div className="flex items-center justify-center mb-6">
  <img src="/logo.svg" alt="Community Care" className="w-28 h-20 object-contain drop-shadow-md animate-pulse" />
</div><h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Community Care</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Autonomous Relief & Dispatch</p>
        <div className="w-full mt-10">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#0f172a] rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between mt-2 text-[11px] font-bold text-slate-500">
            <span>Setting up dashboard...</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
        <img src="/logo.svg" alt="CommunityCare" className="w-10 h-10 object-contain drop-shadow-sm" />
        <span>Official Community Care Platform</span>
      </div>
    </div>
  );
}

function RoleRouter() {
  const { currentUser, logout, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showSplash) return <SplashScreen />;
  if (!currentUser) return <Login />;

  const role = (currentUser.role || 'ADMIN').toUpperCase();

  switch (role) {
    case 'ADMIN':
      return <DashboardLayout currentUser={currentUser} onLogout={logout} />;
    case 'RECIPIENT':
    case 'RECEIVER':
      return <RecipientDashboard currentUser={currentUser} onLogout={logout} />;
    case 'DONOR':
      return <DonorDashboard currentUser={currentUser} onLogout={logout} />;
    case 'VOLUNTEER':
      return <VolunteerDashboard currentUser={currentUser} onLogout={logout} />;
    default:
      return <DashboardLayout currentUser={currentUser} onLogout={logout} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <RoleRouter />
      </DataProvider>
    </AuthProvider>
  );
}