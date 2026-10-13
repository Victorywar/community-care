import React from 'react';
import { 
  X, 
  LayoutDashboard, 
  HelpCircle, 
  Heart, 
  Truck, 
  Users, 
  Receipt, 
  MessageSquare,
  LogOut,
  HeartHandshake
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, currentUser, onLogout, isOpen, onClose }) {
  const navItems = [
    { id: 'home', label: 'Dashboard Home', icon: LayoutDashboard },
    { id: 'requests', label: 'Help Requests', icon: HelpCircle },
    { id: 'donations', label: 'Donation Management', icon: Heart },
    { id: 'dispatch', label: 'Volunteer Dispatch', icon: Truck },
    { id: 'members', label: 'Community Members', icon: Users },
    { id: 'receipts', label: 'Digital Receipts', icon: Receipt },
    { id: 'chat', label: 'Live Relay Chat', icon: MessageSquare },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-[#090e1f] text-white p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out
      md:static md:translate-x-0 md:min-h-screen
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
    `}>
      <div>
        <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-slate-800 flex items-center justify-center shadow-md">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-tight leading-tight text-white">CommunityCare</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Relief & Dispatch</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-5 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Navigation Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
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

      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between bg-black/60 p-2.5 rounded-2xl border border-slate-800">
          <div className="truncate pr-2">
            <p className="text-xs font-semibold text-white truncate">{currentUser?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser?.email || 'admin@communitycare.org'}</p>
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
  );
}