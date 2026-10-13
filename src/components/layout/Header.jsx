import React, { useState, useEffect } from 'react';
import { Bell, LogOut, HeartHandshake, User, Settings, CheckCheck, Menu } from 'lucide-react';
import { api } from '../../services/api';
import ProfileSettingsModal from './ProfileSettingsModal';

export default function Header({ currentUser, onLogout, onToggleSidebar, activeTitle }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifTray, setShowNotifTray] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState(currentUser);

  const fetchNotifs = async () => {
    const list = await api.getNotifications(userProfile?.role);
    setNotifications(list);
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 8000); // Live poll for real-time notifications
    return () => clearInterval(interval);
  }, [userProfile?.role]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    await api.markNotificationsRead();
    fetchNotifs();
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-base text-slate-900 leading-tight">CommunityCare</h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-blue-600">{activeTitle || userProfile?.role || 'Platform'}</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          {/* Notification Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifTray(!showNotifTray)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 text-[9px] font-black bg-rose-500 text-white rounded-full ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer / Tray */}
            {showNotifTray && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && <span className="bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full text-[10px]">{unreadCount} new</span>}
                  </div>
                  <button onClick={handleMarkAllRead} className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">No notifications yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n._id} className={`py-2.5 px-2 rounded-xl ${!n.read ? 'bg-blue-50/50' : ''}`}>
                        <p className="font-bold text-slate-800">{n.title}</p>
                        <p className="text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                        <span className="text-[9px] text-slate-400 mt-1 block">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile DP & Settings Toggle */}
          <button 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
            title="Profile & DP Settings"
          >
            <div className="w-7 h-7 rounded-xl overflow-hidden bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
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

          {/* Logout */}
          <button onClick={onLogout} className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Profile & DP Edit Modal */}
      <ProfileSettingsModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={userProfile}
        onProfileUpdated={(updated) => setUserProfile(updated)}
      />
    </>
  );
}