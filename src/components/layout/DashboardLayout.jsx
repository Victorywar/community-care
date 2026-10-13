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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex min-h-screen bg-[#f8faff] text-slate-800 relative overflow-x-hidden">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        activeTab={activeTab} 
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }} 
        currentUser={currentUser} 
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header 
          currentUser={currentUser} 
          onLogout={onLogout} 
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />
        
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-10">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}