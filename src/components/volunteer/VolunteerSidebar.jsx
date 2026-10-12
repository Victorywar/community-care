import React from 'react';
import { 
  LayoutDashboard, 
  GitCommit, 
  PackageSearch, 
  CheckSquare, 
  Truck, 
  History, 
  Award, 
  MessageSquare, 
  LogOut, 
  UserCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function VolunteerSidebar({ activeTab, setActiveTab, taskCounts }) {
  const { logout, currentUser } = useAuth();

  const mainNav = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'timeline', label: 'My Timeline', icon: GitCommit, count: taskCounts.assigned, highlight: true },
    { id: 'available', label: 'Available Requests', icon: PackageSearch, count: taskCounts.open },
    { id: 'assigned', label: 'Assigned Tasks', icon: CheckSquare, count: taskCounts.assigned },
    { id: 'history', label: 'Completed History', icon: History, count: taskCounts.completed },
    { id: 'impact', label: 'My Impact', icon: Award },
    { id: 'relay', label: 'Field Relay Chat', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-[#080d1d] text-white flex flex-col justify-between shrink-0 border-r border-slate-800 h-screen sticky top-0 font-sans">
      <div>
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-sm">
              <Truck size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight leading-none text-white">CommunityCare</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Field Console</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} strokeWidth={2} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-slate-950 text-amber-400'
                        : item.highlight
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile & Logout */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="px-3 py-2 bg-slate-900/60 rounded-xl mb-3 border border-slate-800 text-xs flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold">
            <UserCheck size={14} />
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-white truncate text-[11px]">{currentUser?.name || 'Field Volunteer'}</p>
            <span className="text-[9px] text-emerald-400 font-semibold block">● Field Active</span>
          </div>
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
