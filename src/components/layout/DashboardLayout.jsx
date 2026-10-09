import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavBar from './MobileNavBar';
import LiveRelayChat from '../../pages/relay/LiveRelayChat';
import DigitalReceiptsLedger from '../../pages/receipts/DigitalReceiptsLedger';

export default function DashboardLayout({ children, currentUser, onLogout }) {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'relay': return 'Live Dispatch Relay';
      case 'receipts': return 'Digital Receipts Ledger';
      case 'requests': return 'Help Requests';
      case 'donations': return 'Donation Management';
      case 'dispatch': return 'Volunteer Dispatch';
      default: return `${currentUser?.role || 'Admin'} Console`;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        currentUser={currentUser} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 overflow-y-auto">
        <Header 
          title={getHeaderTitle()}
          subtitle="Real-time aid allocation, verified drop-offs, and transparent support" 
          onLogout={onLogout}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        
        <main className="p-4 sm:p-6 md:p-8 space-y-6">
          {currentTab === 'relay' && <LiveRelayChat currentUser={currentUser} />}
          {currentTab === 'receipts' && <DigitalReceiptsLedger />}
          {currentTab !== 'relay' && currentTab !== 'receipts' && children}
        </main>
      </div>

      {/* Bottom bar rendered on mobile screens */}
      <MobileNavBar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
      />
    </div>
  );
}