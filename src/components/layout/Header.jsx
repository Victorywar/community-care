import React from 'react';
import { Menu, Bell, LogOut, ShieldCheck } from 'lucide-react';

export default function Header({ currentUser, onLogout, onToggleSidebar }) {
  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden focus:outline-none transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Command Platform</h1>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Live Operation & Dispatch Registry</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{currentUser?.role || 'Admin'}</span>
        </div>
        <button 
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 relative transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
        </button>
        <button 
          onClick={onLogout}
          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}