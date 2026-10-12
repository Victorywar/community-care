import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ReceiverDashboard from './pages/receiver/ReceiverDashboard';
import { ShieldCheck } from 'lucide-react';

function SplashScreen() {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 15) + 10;
        return Math.min(prev + step, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-white flex flex-col justify-between items-center px-6 py-8 select-none z-50">
      <div className="h-4"></div>

      {/* Center Branding Area */}
      <div className="flex flex-col items-center max-w-xs w-full">
        {/* Circular Emblem Container */}
        <div className="w-36 h-36 rounded-full bg-white border-2 border-slate-200/80 shadow-lg shadow-slate-100 flex items-center justify-center p-3 mb-8">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circular Badge Ring */}
            <circle cx="50" cy="50" r="46" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="41" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 3" />
            
            {/* Outline Heart Emblem */}
            <path
              d="M50 72 C47 69, 22 47, 22 30 C22 19, 30 12, 40 12 C46.5 12, 48.5 15, 50 18 C51.5 15, 53.5 12, 60 12 C70 12, 78 19, 78 30 C78 47, 53 69, 50 72 Z"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Inner Community Silhouette */}
            <circle cx="41" cy="34" r="3.2" fill="#0f172a" />
            <circle cx="59" cy="34" r="3.2" fill="#f59e0b" />
            <path
              d="M36 48 C36 42, 45 42, 50 46 C55 42, 64 42, 64 48"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight text-center">
          Community Care
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium text-center mt-1.5">
          Relief & Dispatch Engine
        </p>

        {/* Horizontal Progress Bar & Progress Counter */}
        <div className="w-full mt-16">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0f172a] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2.5 text-[11px] font-semibold text-slate-500">
            <span>Setting up your dashboard...</span>
            <span className="font-bold text-[#0f172a]">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Verification Footer */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium tracking-wide">
        <ShieldCheck size={14} className="text-slate-400" />
        <span>Official Community Care Platform • Autonomous</span>
      </div>
    </div>
  );
}

function AppContent() {
  const { currentUser, logout, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showSplash) {
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