import React, { useState } from 'react';
import { HeartHandshake, Shield, User, Heart, Truck, ArrowRight } from 'lucide-react';

export default function LoginModal({ onLogin }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('DONOR');
  const [name, setName] = useState('');

  const roles = [
    { id: 'ADMIN', label: 'Admin', icon: Shield, defaultEmail: 'admin@communitycare.org' },
    { id: 'DONOR', label: 'Donor', icon: Heart, defaultEmail: 'donor@communitycare.org' },
    { id: 'VOLUNTEER', label: 'Volunteer', icon: Truck, defaultEmail: 'volunteer@communitycare.org' },
    { id: 'RECIPIENT', label: 'Receiver', icon: User, defaultEmail: 'receiver@communitycare.org' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeRole = roles.find(r => r.id === role);
    const user = {
      name: name.trim() || activeRole?.label || 'User',
      email: email.trim() || activeRole?.defaultEmail || `${role.toLowerCase()}@communitycare.org`,
      role: role
    };
    onLogin(user);
  };

  const selectRole = (rId) => {
    setRole(rId);
    const selected = roles.find(r => r.id === rId);
    if (selected) {
      setEmail(selected.defaultEmail);
      setName(selected.label);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">CommunityCare</h1>
          <p className="text-xs text-slate-500 font-medium">Select your portal role to access live dashboards</p>
        </div>

        {/* Role Selector Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {roles.map((r) => {
            const Icon = r.icon;
            const active = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => selectRole(r.id)}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                  active 
                    ? 'border-black bg-black text-white shadow-md scale-102' 
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@communitycare.org"
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition flex items-center justify-center gap-2 mt-4"
          >
            <span>Enter as {roles.find(r => r.id === role)?.label}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}