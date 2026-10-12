import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  PackageCheck, 
  Bell, 
  User, 
  HelpCircle, 
  LogOut, 
  HeartHandshake,
  PlusCircle,
  GitCommit
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RecipientSidebar({ activeTab, setActiveTab, counts, onOpenModal }) {
  const { logout, currentUser } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timeline', label: 'Track My Requests', icon: GitCommit, count: (counts?.active || 0) + (counts?.pending || 0), highlight: true },
    { id: 'requests', label: 'All Requests', icon: Clock, count: counts?.total || 0 },
    { id: 'received', label: 'Received Donations', icon: PackageCheck, count: counts?.received || 0 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-[#080d1d] text-white flex flex-col justify-between shrink-0 border-r border-slate-800 h-screen sticky top-0 font-sans z-30">
      <div>
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md">
              <HeartHandshake size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight leading-none text-white">CommunityCare</h1>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mt-1">Recipient Hub</span>
            </div>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={onOpenModal}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <PlusCircle size={15} />
            <span>Request Donation</span>
          </button>
        </div>

        <nav className="p-3 pt-0 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer " +
                  (isActive
                    ? "bg-blue-600 text-white shadow-sm font-black"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50")
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={
                    "text-[10px] font-black px-1.5 py-0.5 rounded-full " +
                    (isActive
                      ? "bg-white text-blue-700"
                      : item.highlight
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-slate-800 text-slate-400")
                  }>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/80">
        <div className="px-3 py-2 bg-slate-900/60 rounded-xl mb-3 border border-slate-800 text-xs">
          <p className="font-bold text-white truncate text-[11px]">{currentUser?.name || 'Verified Recipient'}</p>
          <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">● Active Recipient</span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}