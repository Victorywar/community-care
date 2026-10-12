import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import HelpRequests from '../../pages/admin/HelpRequests';
import DonationManagement from '../../pages/admin/DonationManagement';
import VolunteerDispatch from '../../pages/admin/VolunteerDispatch';
import CommunityMembers from '../../pages/admin/CommunityMembers';
import DigitalReceipts from '../../pages/admin/DigitalReceipts';
import LiveRelayChat from '../../pages/admin/LiveRelayChat';

export default function DashboardLayout({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <AdminDashboard />;
      case 'requests':
        return <HelpRequests />;
      case 'donations':
        return <DonationManagement />;
      case 'dispatch':
        return <VolunteerDispatch />;
      case 'members':
        return <CommunityMembers />;
      case 'receipts':
        return <DigitalReceipts />;
      case 'chat':
        return <LiveRelayChat />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <Sidebar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        currentUser={currentUser} 
        onLogout={onLogout} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header currentUser={currentUser} onLogout={onLogout} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}