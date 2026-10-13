import React, { useState } from 'react';
import Header from './Header';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import HelpRequests from '../../pages/admin/HelpRequests';
import DonationManagement from '../../pages/admin/DonationManagement';
import VolunteerDispatch from '../../pages/admin/VolunteerDispatch';
import LiveRelayChat from '../../pages/admin/LiveRelayChat';
import { LayoutDashboard, HelpCircle, Heart, Truck, MessageSquare } from 'lucide-react';

export default function DashboardLayout({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'requests', label: 'Verify', icon: HelpCircle },
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
      case 'chat': return <LiveRelayChat currentUser={currentUser} />;
      default: return <AdminDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 pb-20 select-none">
      <Header currentUser={currentUser} onLogout={onLogout} activeTitle="Admin Control Platform" />
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        {renderActiveScreen()}
      </main>

      {/* Phone Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 z-50 flex justify-around py-2 shadow-lg">
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