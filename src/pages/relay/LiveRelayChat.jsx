import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  Truck, 
  HeartHandshake, 
  Clock, 
  Search,
  CheckCheck,
  Radio
} from 'lucide-react';

const initialRelayMessages = [
  {
    id: 1,
    senderId: 'USR-ADM-01',
    senderName: 'Sarah Jenkins',
    role: 'ADMIN',
    text: 'Priority Alert: Medical aid dispatch REQ-101 (Insulin units) has been verified and authorized for transit.',
    timestamp: '10:45 AM',
    channel: 'Dispatches'
  },
  {
    id: 2,
    senderId: 'USR-DNR-02',
    senderName: 'Anand Kumar',
    role: 'DONOR',
    text: 'Package is packed in a cold-pack sealed box at Greenways Road security desk. Gate code is 4421.',
    timestamp: '10:48 AM',
    channel: 'Dispatches'
  },
  {
    id: 3,
    senderId: 'USR-VOL-03',
    senderName: 'Kavitha Raman',
    role: 'VOLUNTEER',
    text: 'Picked up the package from Anand. En route to Gandhi Nagar, Ward 4 now.',
    timestamp: '10:52 AM',
    channel: 'Dispatches'
  },
  {
    id: 4,
    senderId: 'USR-RCV-04',
    senderName: 'Priya Sundaram',
    role: 'RECEIVER',
    text: 'Thank you team! I am waiting near the community health center entrance.',
    timestamp: '10:55 AM',
    channel: 'Dispatches'
  }
];

export default function LiveRelayChat({ currentUser }) {
  const [messages, setMessages] = useState(initialRelayMessages);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannel, setActiveChannel] = useState('All');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      senderId: currentUser?.id || 'USR-ANON',
      senderName: currentUser?.name || 'Anonymous User',
      role: currentUser?.role || 'VOLUNTEER',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: activeChannel === 'All' ? 'Dispatches' : activeChannel
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <ShieldCheck size={11} /> Admin
          </span>
        );
      case 'DONOR':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
            <HeartHandshake size={11} /> Donor
          </span>
        );
      case 'VOLUNTEER':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Truck size={11} /> Volunteer
          </span>
        );
      case 'RECEIVER':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            <User size={11} /> Receiver
          </span>
        );
      default:
        return null;
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch = m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.senderName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = activeChannel === 'All' || m.channel === activeChannel;
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[calc(100vh-160px)] min-h-[550px]">
      
      {/* Top Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#080d1d] text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <MessageSquare size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Live Relay Broadcast</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Radio size={10} className="animate-pulse" /> LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct field coordination between Donors, Volunteers, Receivers & Admins
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feed messages..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#121c38] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Filter Channel Tabs */}
      <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold text-[11px] uppercase">Channel:</span>
          {['All', 'Dispatches', 'Urgent Aid', 'General'].map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChannel === ch 
                  ? 'bg-[#0b1329] text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
        <span className="text-slate-400 text-[11px] font-medium hidden md:inline">
          Posting as: <strong className="text-slate-700">{currentUser?.name}</strong> ({currentUser?.role})
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
            <MessageSquare size={32} className="mb-2 text-slate-300" />
            <p>No messages matching your search or channel filter.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMe = msg.senderName === currentUser?.name || msg.role === currentUser?.role;

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-2xl ${isMe ? 'ml-auto' : 'mr-auto'}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  {getRoleBadge(msg.role)}
                  <span className="text-xs font-bold text-slate-800">{msg.senderName}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Clock size={10} /> {msg.timestamp}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-[#0b1329] text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {isMe && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                    <span>Delivered to relay</span>
                    <CheckCheck size={12} className="text-blue-500" />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Composer */}
      <form onSubmit={handleSendMessage} className="p-3.5 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type an update as ${currentUser?.name || 'User'} (${currentUser?.role || ''})...`}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all shadow-xs"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="py-3 px-5 rounded-xl bg-[#0b1329] hover:bg-[#152244] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-40"
        >
          <Send size={15} />
          <span className="hidden sm:inline">Send Relay</span>
        </button>
      </form>

    </div>
  );
}