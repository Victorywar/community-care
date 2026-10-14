import React, { useState } from 'react';
import { ShieldCheck, Heart, Truck, UserCheck, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('DONOR');
  const [name, setName] = useState('Midhuna');
  const [email, setEmail] = useState('donor@communitycare.org');

  const roles = [
    { id: 'DONOR', label: 'Donor Platform', desc: 'Pledge food, clothes & relief resources', icon: Heart, defaultEmail: 'donor@communitycare.org' },
    { id: 'VOLUNTEER', label: 'Field Volunteer', desc: 'Accept transit runs & verify delivery handovers', icon: Truck, defaultEmail: 'volunteer@communitycare.org' },
    { id: 'RECIPIENT', label: 'Recipient / Receiver', desc: 'Request aid, confirm receipt & write reviews', icon: UserCheck, defaultEmail: 'recipient@communitycare.org' },
    { id: 'ADMIN', label: 'Admin Command', desc: 'Authorize requisitions & coordinate fleet', icon: ShieldCheck, defaultEmail: 'admin@communitycare.org' },
  ];

  const handleRoleSelect = (roleId, defEmail) => {
    setSelectedRole(roleId);
    setEmail(defEmail);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name: name.trim() || 'Demo User',
      email: email.trim(),
      role: selectedRole
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-20 h-20 rounded-full border border-emerald-300 bg-emerald-50/70 p-3 items-center justify-center shadow-xs">
            <img src="/logo.svg" alt="Community Care" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Community Care</h1>
          <p className="text-xs text-slate-500 font-medium">Select your portal role to authenticate</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                type="button"
                key={r.id}
                onClick={() => handleRoleSelect(r.id, r.defaultEmail)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isSelected 
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs' 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                </div>
                <div>
                  <p className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>{r.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">{r.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Registered Email</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 shadow-md transition"
          >
            Access {selectedRole} Workspace <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}