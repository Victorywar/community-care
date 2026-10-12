import React, { useState } from 'react';
import { Users, Search, ShieldCheck, Mail, Phone, MapPin, UserPlus } from 'lucide-react';

export default function CommunityMembers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const members = [
    { id: 'MBR-01', name: 'Sarah Jenkins', role: 'ADMIN', email: 'admin@communitycare.org', phone: '+91 91234 56780', location: 'Central Headquarters' },
    { id: 'MBR-02', name: 'Anand Kumar', role: 'DONOR', email: 'donor@communitycare.org', phone: '+91 91234 56781', location: 'Chennai South' },
    { id: 'MBR-03', name: 'Kavitha Raman', role: 'VOLUNTEER', email: 'volunteer@communitycare.org', phone: '+91 91234 56782', location: 'Gandhi Nagar Ward 4' },
    { id: 'MBR-04', name: 'Priya Sundaram', role: 'RECEIVER', email: 'receiver@communitycare.org', phone: '+91 91234 56783', location: 'Kamaraj Colony' }
  ];

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Community Members</h1>
          <p className="text-xs text-slate-500 mt-1">Directory of registered donors, field volunteers, and verified recipients</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by member name, email or ward..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'ADMIN', 'DONOR', 'VOLUNTEER', 'RECEIVER'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer ${
                roleFilter === r ? 'bg-[#080d1d] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMembers.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-700 text-xs">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <span>{m.name}</span>
                        <p className="text-[10px] text-slate-400 font-normal">{m.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>{m.email}</div>
                    <div className="text-[10px] text-slate-400">{m.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{m.location}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                      <ShieldCheck size={12}/> Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}