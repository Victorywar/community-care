import React from 'react';
import { LogOut, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Header({ currentUser, onLogout, activeTitle }) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
          <HeartHandshake className="w-4 h-4" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-slate-900 leading-tight">CommunityCare</h1>
          <p className="text-[10px] font-medium text-slate-400 capitalize">{currentUser?.role?.toLowerCase() || 'Platform'}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full truncate max-w-[110px]">
          {currentUser?.name || 'User'}
        </span>
        <button 
          onClick={onLogout}
          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}