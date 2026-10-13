import React, { useState, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { api } from '../../services/api';

export default function LiveRelayChat({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const fetchChat = async () => {
    try {
      const data = await api.getMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => { fetchChat(); }, []);

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.sendMessage(text);
      setText('');
      fetchChat();
    } catch {
      // optimistic fallback
      setMessages(prev => [...prev, { text, sender: currentUser?.name || 'Me', createdAt: new Date() }]);
      setText('');
    }
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-blue-600" />
        <span className="font-bold text-xs text-slate-800">Operational Relay Channel</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-[11px]">
            No messages sent yet. Transmit the first message below.
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
              <span className="font-bold text-[10px] text-blue-600">{m.sender || 'Staff'}</span>
              <p className="text-slate-800">{m.text}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={sendMsg} className="p-2 border-t border-slate-100 flex gap-2">
        <input 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Type message..." 
          className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
        />
        <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}