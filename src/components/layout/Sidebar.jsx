import React from 'react';
import { 
  LayoutDashboard, 
  Heart, 
  Truck, 
  Users, 
  Clock, 
  MessageSquare, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({ currentUser, activeTab, onSelectTab, isOpen, onClose, onLogout }) {
  const role = (currentUser?.role || 'RECIPIENT').toUpperCase();

  const getMenuItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'inventory', label: 'Inventory & Needs', icon: Heart },
          { id: 'fleet', label: 'Volunteer Fleet', icon: Truck },
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'timeline', label: 'Audit Timeline', icon: Clock },
          { id: 'chat', label: 'Relay Dispatch', icon: MessageSquare },
        ];
      case 'DONOR':
        return [
          { id: 'home', label: 'Giving Hub', icon: LayoutDashboard },
          { id: 'my-donations', label: 'My Contributions', icon: Heart },
          { id: 'timeline', label: 'Aid Pipeline', icon: Clock },
          { id: 'chat', label: 'Field Relay', icon: MessageSquare },
        ];
      case 'VOLUNTEER':
        return [
          { id: 'home', label: 'Mission Deck', icon: LayoutDashboard },
          { id: 'timeline', label: 'Transit Stream', icon: Clock },
          { id: 'chat', label: 'Field Relay', icon: MessageSquare },
        ];
      case 'RECIPIENT':
      case 'RECEIVER':
      default:
        return [
          { id: 'home', label: 'Requisition Board', icon: LayoutDashboard },
          { id: 'chat', label: 'Field Relay', icon: MessageSquare },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-2xs z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between
        transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-8 flex items-center justify-center shrink-0">
                <img src="/logo.svg" alt="CommunityCare" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="font-black text-sm text-slate-900 leading-tight">CommunityCare</h2>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{role} PORTAL</p>
              </div>
            </div>
            {onClose && (
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    active 
                      ? 'bg-black text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-black text-white font-bold text-xs flex items-center justify-center">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="truncate text-left">
              <p className="font-bold text-xs text-slate-800 truncate">{currentUser?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser?.email || role}</p>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}