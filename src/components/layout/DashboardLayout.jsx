import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import HelpRequests from '../../pages/admin/HelpRequests';
import DonationManagement from '../../pages/admin/DonationManagement';

export default function DashboardLayout({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        currentUser={currentUser} 
        onLogout={onLogout} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header currentUser={currentUser} onLogout={onLogout} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'home' && <AdminDashboard />}
          {activeTab === 'requests' && <HelpRequests />}
          {activeTab === 'donations' && <DonationManagement />}
          {/* Default fallback */}
          {!['home', 'requests', 'donations'].includes(activeTab) && <AdminDashboard />}
        </main>
      </div>
    </div>
  );
}