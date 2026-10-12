import React from 'react';
import Logo from '../common/Logo';
import { 
  LayoutDashboard, 
  HelpCircle, 
  HeartHandshake, 
  Truck, 
  Users, 
  FileText, 
  MessageSquare,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activeTab = 'home', onSelectTab, currentUser, onLogout }) {
  const menuItems = [
    { id: 'home', label: 'Dashboard Home', icon: LayoutDashboard },
    { id: 'requests', label: 'Help Requests', icon: HelpCircle },
    { id: 'donations', label: 'Donation Management', icon: HeartHandshake },
    { id: 'dispatch', label: 'Volunteer Dispatch', icon: Truck },
    { id: 'members', label: 'Community Members', icon: Users },
    { id: 'receipts', label: 'Digital Receipts', icon: FileText },
    { id: 'chat', label: 'Live Relay Chat', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#080d1d] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      {/* Top Branding Section */}
      <div>
        <div className="p-6 border-b border-slate-800/70">
          <Logo size="md" inverted={true} showText={true} />
        </div>

        {/* Navigation List */}
        <div className="px-3 py-6 space-y-1">
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-3">
            Navigation Menu
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab && onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#152445] text-white shadow-xs border-l-3 border-blue-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} 
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User Profile & Logout */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center gap-3 px-2 py-1.5 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            {currentUser?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {currentUser?.name || 'Administrator'}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck size={11} className="text-emerald-400 shrink-0" />
              <span className="truncate">{currentUser?.role || 'ADMIN'}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}