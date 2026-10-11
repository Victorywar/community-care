import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
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

  const role = (currentUser?.role || '').toLowerCase();

  // Logged in -> Route to their dashboard
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