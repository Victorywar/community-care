import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Send, MessageSquare, RefreshCw, Clock } from 'lucide-react';

export default function LiveRelayChat() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await api.getMessages();
      if (Array.isArray(res)) {
        setMessages(res);
      }
    } catch (err) {
      console.error('Failed to load chat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    try {
      setSending(true);
      const newMsg = await api.sendMessage(inputMessage.trim());
      if (newMsg && newMsg._id) {
        setMessages((prev) => [...prev, newMsg]);
        setInputMessage('');
      }
    } catch (err) {
      console.error('Failed to send:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Live Relay Chat
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time direct communication between Admin, Volunteers, and Donors
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[65vh] overflow-hidden">
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {loading && messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Connecting to secure communication channel...
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <MessageSquare size={32} className="text-slate-300" />
              <p className="text-xs font-bold">No messages in channel yet</p>
              <p className="text-[11px] text-slate-400">
                Send a message below to broadcast to all active units.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderName === (currentUser?.name || 'Admin');
              return (
                <div
                  key={msg._id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-slate-700">
                      {msg.senderName} ({msg.senderRole})
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      <Clock size={10} />
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${
                      isMe
                        ? 'bg-[#080d1d] text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-100 flex gap-2 bg-slate-50/50">
          <input
            type="text"
            placeholder="Type your message to field team..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={sending || !inputMessage.trim()}
            className="px-4 py-2.5 bg-[#080d1d] hover:bg-slate-800 text-white rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-xs"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}