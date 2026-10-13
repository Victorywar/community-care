import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, RefreshCw, AlertCircle, Shield } from 'lucide-react';
import { api } from '../../services/api';

export default function CommunityMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      // Zero static fallback. Real DB users only.
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900">Registered Community Personnel</h2>
          <p className="text-xs text-slate-400">Live roster of active database accounts</p>
        </div>
        <button onClick={fetchUsers} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {members.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No external users registered yet</p>
          <p className="text-xs text-slate-400 mt-1">Users will dynamically appear here when they register or save their profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {members.map((m) => (
            <div key={m._id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base overflow-hidden shrink-0 shadow-sm">
                {m.avatar ? <img src={m.avatar} alt="Avatar" className="w-full h-full object-cover" /> : (m.name?.charAt(0) || 'U')}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 truncate">{m.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    {m.role || 'Member'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> {m.email}
                </p>
                {m.phone && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {m.phone}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}