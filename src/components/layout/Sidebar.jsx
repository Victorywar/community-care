import React from 'react';
import { 
  LayoutDashboard, 
  HeartHandshake, 
  Truck, 
  Users, 
  HelpCircle, 
  FileText, 
  MessageSquare,
  X
} from 'lucide-react';
import Logo from '../common/Logo';

export default function Sidebar({ currentTab, setCurrentTab, currentUser, isOpen, onClose }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Home', icon: LayoutDashboard },
    { id: 'requests', label: 'Help Requests', icon: HelpCircle },
    { id: 'donations', label: 'Donation Management', icon: HeartHandshake },
    { id: 'dispatch', label: 'Volunteer Dispatch', icon: Truck },
    { id: 'users', label: 'Community Members', icon: Users },
    { id: 'receipts', label: 'Digital Receipts', icon: FileText },
    { id: 'relay', label: 'Live Relay Chat', icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed md:static top-0 bottom-0 left-0 z-50 w-64 bg-[#0b1329] flex flex-col justify-between border-r border-slate-800 text-slate-300 min-h-screen select-none shrink-0 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-[#080d1d]">
            <Logo size="sm" inverted={true} showText={true} />
            <button 
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 pt-5 pb-2">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Navigation Menu
            </span>
          </div>

          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#162244] text-white font-semibold border-l-4 border-blue-500 rounded-l-none'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800 bg-[#080d1d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-inner shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {currentUser?.role || 'SYSTEM ADMIN'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}