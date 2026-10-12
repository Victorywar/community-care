import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  RefreshCw 
} from 'lucide-react';

export default function CommunityMembers() {
  const [members, setMembers] = useState([]);
  const [filterRole, setFilterRole] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState('');

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await api.getMembers();
      if (Array.isArray(res)) {
        setMembers(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleStatusChange = async (memberId, isApproved) => {
    try {
      await api.updateMemberStatus(memberId, isApproved);
      setAlertMsg(isApproved ? 'Member approved successfully!' : 'Member approval revoked/rejected.');
      loadMembers();
      setTimeout(() => setAlertMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesRole = filterRole === 'ALL' || (m.role || '').toUpperCase() === filterRole;
    const matchesSearch = 
      (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Community Members</h1>
          <p className="text-xs text-slate-500 mt-1">Directory of registered donors, field volunteers, and recipients with live verification desk</p>
        </div>

        <button
          onClick={loadMembers}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh List</span>
        </button>
      </div>

      {alertMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by member name, email, or ward..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['ALL', 'ADMIN', 'DONOR', 'VOLUNTEER', 'RECEIVER'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                filterRole === role
                  ? 'bg-[#080d1d] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-10">Loading real database records...</p>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No registered members match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Approval / Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((m) => {
                  const isPending = m.role === 'VOLUNTEER' && !m.isApproved;
                  return (
                    <tr key={m._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-[#080d1d] font-black flex items-center justify-center text-xs">
                            {(m.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{m.name}</p>
                            <span className="text-[10px] font-mono text-slate-400">ID: {m._id.slice(-6)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded-full border ${
                          m.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          m.role === 'DONOR' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          m.role === 'VOLUNTEER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {m.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{m.email}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{m.phone || 'No phone'}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-600 font-medium">{m.address || 'Not specified'}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold text-[10px]">
                            <Clock size={11} /> Pending Approval
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px]">
                            <CheckCircle2 size={11} /> Verified / Active
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {m.role === 'ADMIN' ? (
                          <span className="text-[11px] text-slate-400 font-semibold">Master Admin</span>
                        ) : isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStatusChange(m._id, true)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 size={12} /> Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(m._id, false)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] rounded-lg transition-all border border-rose-200 cursor-pointer flex items-center gap-1"
                            >
                              <XCircle size={12} /> Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(m._id, false)}
                            className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}