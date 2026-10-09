import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ReceiverDashboard from './pages/receiver/ReceiverDashboard';

function AppContent() {
  const { currentUser, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xs font-medium text-slate-500">Loading Community Care...</div>
      </div>
    );
  }

  // Not logged in -> Show Login
  if (!currentUser) {
    return <Login />;
  }

  // Logged in -> Route to their dashboard
  return (
    <DashboardLayout currentUser={currentUser} onLogout={logout}>
      {currentUser.role === 'ADMIN' && <AdminDashboard />}
      {currentUser.role === 'RECEIVER' && <ReceiverDashboard currentUser={currentUser} />}
      
      {/* Fallback placeholder for Donor and Volunteer (which we build next) */}
      {(currentUser.role === 'DONOR' || currentUser.role === 'VOLUNTEER') && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-lg mx-auto mt-12 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Welcome, {currentUser.name}!
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <span className="font-semibold text-blue-600">{currentUser.role}</span>
          </p>
          <p className="text-xs text-slate-400 mt-4">
            Next module to be loaded: {currentUser.role} Console.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}