import React, { useState } from 'react';
import { Send, MessageSquare, Shield, Clock } from 'lucide-react';

export default function LiveRelayChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Kavitha (Volunteer)', role: 'VOLUNTEER', text: 'Reached Ward 4 Gandhi Nagar. Handing over 10 kits now.', time: '10:45 AM' },
    { id: 2, sender: 'Sarah (Admin)', role: 'ADMIN', text: 'Confirmed Kavitha. Please capture recipient signature on app.', time: '10:46 AM' },
    { id: 3, sender: 'Anand (Donor)', role: 'DONOR', text: 'Thank you team! Happy to see fast dispatch.', time: '10:48 AM' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'Sarah (Admin)',
      role: 'ADMIN',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Live Relay Chat</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time coordination channel between Admin, Volunteer dispatchers, and Donors</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Chat Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map(m => {
            const isAdmin = m.role === 'ADMIN';
            return (
              <div key={m.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1">
                  <span>{m.sender}</span>
                  <span>•</span>
                  <span>{m.time}</span>
                </div>
                <div className={`px-4 py-2.5 rounded-2xl max-w-sm sm:max-w-md text-xs leading-relaxed ${
                  isAdmin 
                    ? 'bg-[#080d1d] text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                }`}>
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Box */}
        <form onSubmit={handleSend} className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message to field team..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2.5 bg-[#080d1d] hover:bg-slate-800 text-white rounded-2xl transition-all cursor-pointer"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}