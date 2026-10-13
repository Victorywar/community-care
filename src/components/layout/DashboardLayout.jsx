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
import { LayoutDashboard, HelpCircle, Heart, Truck, MessageSquare } from 'lucide-react';

export default function DashboardLayout({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'requests', label: 'Requests', icon: HelpCircle },
    { id: 'donations', label: 'Donations', icon: Heart },
    { id: 'dispatch', label: 'Dispatch', icon: Truck },
    { id: 'chat', label: 'Relay', icon: MessageSquare },
  ];

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home': return <AdminDashboard onNavigate={setActiveTab} />;
      case 'requests': return <HelpRequests />;
      case 'donations': return <DonationManagement />;
      case 'dispatch': return <VolunteerDispatch />;
      case 'members': return <CommunityMembers />;
      case 'receipts': return <DigitalReceipts />;
      case 'chat': return <LiveRelayChat currentUser={currentUser} />;
      default: return <AdminDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8faff] text-slate-800 relative overflow-x-hidden pb-16 md:pb-0">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component (Desktop pinned, mobile slide-in) */}
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

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header 
          currentUser={currentUser} 
          onLogout={onLogout} 
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          activeTitle="Admin Control Platform"
        />
        
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 z-30 flex md:hidden justify-around py-2 shadow-lg">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-all ${
                active ? 'text-blue-600 scale-105' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}