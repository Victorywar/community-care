import React from 'react';
import { Users, Mail, UserCheck } from 'lucide-react';

export default function CommunityMembers() {
  const members = [
    { name: 'Dr. Nandhini', role: 'Medical Director', sector: 'Central Triage', email: 'nandhini@kcg.edu' },
    { name: 'Rithika R', role: 'Field Lead', sector: 'Sector 2 Distribution', email: 'rithika@communitycare.org' },
    { name: 'Rahamathunisa', role: 'Relief Coordinator', sector: 'Logistics Warehouse', email: 'rahamath@communitycare.org' },
    { name: 'Savitha', role: 'Aid Verification', sector: 'Reception Desk', email: 'savitha@communitycare.org' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900">Community Roster</h2>
        <p className="text-xs text-slate-400">Authenticated project directors, coordinators, and field staff</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {members.map((m, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm shrink-0">
              {m.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm truncate">{m.name}</h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Verified</span>
              </div>
              <p className="text-xs font-medium text-slate-600">{m.role}</p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{m.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}