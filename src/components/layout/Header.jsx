import React, { useState, useEffect } from 'react';
import { Bell, LogOut, User, Settings, CheckCheck, Menu, X, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import ProfileSettingsModal from './ProfileSettingsModal';

export default function Header({ currentUser, onLogout, onToggleSidebar, activeTitle }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifTray, setShowNotifTray] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState(currentUser);

  const fetchNotifs = async () => {
    try {
      const role = userProfile?.role === 'RECIPIENT' ? 'RECEIVER' : userProfile?.role;
      const list = await api.getNotifications(role);
      setNotifications(Array.isArray(list) ? list : []);
    } catch {
      // Keep existing list on transient dip
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 4000);
    return () => clearInterval(interval);
  }, [userProfile?.role]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await api.markNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 pt-[calc(env(safe-area-inset-top)+10px)] pb-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2.5">
            {/* Unified Logo */}
            <div className="w-10 h-8 flex items-center justify-center shrink-0">
              <img src="/logo.svg" alt="CommunityCare" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-base text-slate-900 leading-tight">CommunityCare</h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{activeTitle || userProfile?.role || 'Platform'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifTray(prev => !prev)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 text-[9px] font-black bg-emerald-600 text-white rounded-full ring-2 ring-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifTray && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-2xs md:hidden"
                  onClick={() => setShowNotifTray(false)}
                />
                <div className="fixed inset-x-3 top-16 md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Notifications</span>
                      {unreadCount > 0 ? (
                        <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
                          {unreadCount} new
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          All caught up
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead} 
                          className="text-[11px] font-bold text-slate-600 hover:text-black flex items-center gap-1 transition-colors"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                        </button>
                      )}
                      <button 
                        onClick={() => setShowNotifTray(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 md:hidden"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-1">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center text-slate-400 text-xs">
                        <CheckCircle2 className="w-7 h-7 mx-auto mb-2 text-slate-300" />
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n._id} 
                          className={`py-3 px-2.5 rounded-xl transition-colors ${
                            !n.read ? 'bg-slate-50 font-medium border-l-3 border-emerald-500' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-slate-900 leading-snug text-xs">{n.title}</p>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile DP / Settings Button */}
          <button 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
            title="Profile & DP Settings"
          >
            <div className="w-7 h-7 rounded-xl overflow-hidden bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs border border-slate-800">
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="DP" className="w-full h-full object-cover" />
              ) : (
                userProfile?.name?.charAt(0) || <User className="w-4 h-4" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-bold text-xs text-slate-800 leading-none">{userProfile?.name || 'Account'}</p>
              <p className="text-[10px] text-slate-400 leading-tight">Settings & DP</p>
            </div>
            <Settings className="w-3.5 h-3.5 text-slate-400 hidden sm:block ml-0.5" />
          </button>

          {/* Logout Button */}
          <button 
            onClick={onLogout} 
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors" 
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <ProfileSettingsModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={userProfile}
        onProfileUpdated={(updated) => setUserProfile(updated)}
      />
    </>
  );
}