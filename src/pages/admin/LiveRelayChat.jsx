import React, { useState } from 'react';
import { Send, Shield, MessageSquare } from 'lucide-react';

export default function LiveRelayChat() {
  const [messages, setMessages] = useState([
    { sender: 'Control Base', text: 'All field volunteers please report current location before 19:30.', time: '18:45', isMe: false },
    { sender: 'Volunteer Dispatch 1', text: 'Zone 4 delivery completed. Returning to warehouse for staging.', time: '18:50', isMe: true }
  ]);
  const [text, setText] = useState('');

  const sendMsg = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setMessages([...messages, { sender: 'Me', text, time: 'Just now', isMe: true }]);
    setText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-170px)] bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">Emergency Dispatch Relay</h3>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Encrypted</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-slate-400 mb-0.5 px-1">{m.sender} - {m.time}</span>
            <div className={`max-w-[85%] sm:max-w-md px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium ${
              m.isMe 
                ? 'bg-blue-600 text-white rounded-tr-xs' 
                : 'bg-slate-100 text-slate-800 rounded-tl-xs'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMsg} className="p-2.5 sm:p-3 border-t border-slate-100 bg-white flex gap-2">
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Transmit priority message..." 
          className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
        />
        <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-700 flex items-center gap-1">
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}