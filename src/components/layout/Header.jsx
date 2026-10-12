import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut, UserCheck, Package, Heart, Clock } from 'lucide-react';

export default function Header() {
  const { logout, currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await api.getNotifications();
      if (Array.isArray(res)) {
        setNotifications(res);
      }
    } catch (e) {
      console.warn('Failed to load notifications');
    }
  };

  useEffect(() => {
    fetchNotes();
    const interval = setInterval(fetchNotes, 4000); // 4 வினாடிக்கு ஒருமுறை செக் செய்யும்
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-sm font-black text-slate-800 tracking-tight">Admin Command Platform</h2>
        <p className="text-[10px] text-slate-400">Live Operation & Dispatch Registry</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Real Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all cursor-pointer relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden z-50">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <span className="text-xs font-black text-slate-800">Operational Alerts</span>
                <span className="text-[10px] font-bold text-slate-400">{notifications.length} Total</span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No recent alerts.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`p-3 text-xs flex gap-3 hover:bg-slate-50 transition-colors ${n.unread ? 'bg-amber-50/40' : ''}`}>
                      <div className="mt-0.5">
                        {n.type === 'VOLUNTEER_PENDING' ? (
                          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                            <UserCheck size={14} />
                          </div>
                        ) : n.type === 'AID_REQUEST' ? (
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                            <Package size={14} />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Heart size={14} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-800 text-[11px]">{n.title}</p>
                          <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                            <Clock size={10} />
                            {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#080d1d] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          <LogOut size={13} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}