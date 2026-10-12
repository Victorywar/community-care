import React from 'react';
import { HeartHandshake, Layers, MessageSquare, Receipt, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DonorSidebar({ activeTab, setActiveTab }) {
  const { logout, currentUser } = useAuth();

  const navItems = [
    { id: 'ledger', label: 'Contribution Ledger', icon: Layers },
    { id: 'relay', label: 'Live Relay Chat', icon: MessageSquare },
    { id: 'receipts', label: 'Impact Receipts', icon: Receipt },
  ];

  return (
    <aside className="w-64 bg-[#080d1d] text-white flex flex-col justify-between shrink-0 border-r border-slate-800 h-screen sticky top-0">
      <div>
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <HeartHandshake size={20} />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight leading-none text-white">CommunityCare</h1>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mt-1">Donor Platform</span>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/80">
        <div className="px-3 py-2 bg-slate-900/60 rounded-xl mb-3 border border-slate-800 text-xs">
          <p className="font-bold text-white truncate">{currentUser?.name || 'Verified Donor'}</p>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">● Active Contributor</span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
