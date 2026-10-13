import React, { useState } from 'react';
import Header from './Header';
import { 
  X, 
  Menu, 
  LayoutDashboard, 
  HelpCircle, 
  Heart, 
  Truck, 
  Users, 
  Receipt, 
  MessageSquare,
  LogOut,
  HeartHandshake,
  Clock,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';

export default function AppLayout({ currentUser, onLogout, activeTab, onSelectTab, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = (currentUser?.role || 'RECIPIENT').toUpperCase();

  // Role-specific navigation tabs
  const getNavItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 'home', label: 'Dashboard Home', icon: LayoutDashboard },
          { id: 'requests', label: 'Help Requests', icon: HelpCircle },
          { id: 'donations', label: 'Donation Management', icon: Heart },
          { id: 'dispatch', label: 'Volunteer Dispatch', icon: Truck },
          { id: 'members', label: 'Community Members', icon: Users },
          { id: 'receipts', label: 'Digital Receipts', icon: Receipt },
          { id: 'chat', label: 'Live Relay Chat', icon: MessageSquare },
        ];
      case 'DONOR':
        return [
          { id: 'home', label: 'Verified Relief Needs', icon: Heart },
          { id: 'my-donations', label: 'My Contributions', icon: CheckCircle2 },
          { id: 'timeline', label: 'Live Aid Timelines', icon: Clock },
          { id: 'chat', label: 'Relay Dispatch Chat', icon: MessageSquare },
        ];
      case 'VOLUNTEER':
        return [
          { id: 'home', label: 'Fleet & Transit Jobs', icon: Truck },
          { id: 'my-dispatches', label: 'My Active Deliveries', icon: CheckCircle2 },
          { id: 'timeline', label: 'Field Timelines', icon: Clock },
          { id: 'chat', label: 'Relay Dispatch Chat', icon: MessageSquare },
        ];
      case 'RECIPIENT':
      case 'RECEIVER':
      default:
        return [
          { id: 'home', label: 'My Requisitions', icon: LayoutDashboard },
          { id: 'new-request', label: 'Request Relief Aid', icon: PlusCircle },
          { id: 'timeline', label: 'Order Timelines', icon: Clock },
          { id: 'chat', label: 'Emergency Relay Chat', icon: MessageSquare },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex min-h-screen bg-[#f8faff] text-slate-800 relative overflow-x-hidden">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Persistent Sidebar on Desktop + Slide-out Drawer on Mobile for ALL ROLES */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#090e1f] text-white p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 md:min-h-screen
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div>
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black border border-slate-800 flex items-center justify-center shadow-md">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-base tracking-tight leading-tight text-white">CommunityCare</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{role} PORTAL</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links with Pure Black Highlight */}
          <nav className="mt-5 space-y-1.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Navigation Menu</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                    active 
                      ? 'bg-black text-white border border-slate-700/80 shadow-lg shadow-black/50 font-bold ring-1 ring-white/10' 
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between bg-black/60 p-2.5 rounded-2xl border border-slate-800">
            <div className="truncate pr-2">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.name || 'Account User'}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize">{role.toLowerCase()} • {currentUser?.email}</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header 
          currentUser={currentUser} 
          onLogout={onLogout} 
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          activeTitle={`${role} Platform`}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for quick access */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 z-30 flex md:hidden justify-around py-2 shadow-lg">
        {navItems.slice(0, 4).map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
                active ? 'text-black scale-105 font-black' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[70px]">{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}