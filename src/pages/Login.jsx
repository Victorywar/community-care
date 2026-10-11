import React, { useState } from 'react';
import Logo from '../components/common/Logo';
import { ShieldCheck, HeartHandshake, Truck, User, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('admin@communitycare.org');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { id: 'admin', label: 'Admin', icon: ShieldCheck, email: 'admin@communitycare.org' },
    { id: 'donor', label: 'Donor', icon: HeartHandshake, email: 'donor@communitycare.org' },
    { id: 'volunteer', label: 'Volunteer', icon: Truck, email: 'volunteer@communitycare.org' },
    { id: 'receiver', label: 'Receiver', icon: User, email: 'receiver@communitycare.org' },
  ];

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole.id);
    setEmail(selectedRole.email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin({ role, email });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Mobile Header & Branding */}
      <div className="bg-[#0b1329] text-white px-5 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Logo size="md" inverted={true} />
        </div>
        
        {/* Compact Hero on Mobile */}
        <div className="mt-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Every Contribution, <br />
            <span className="text-blue-400">The Right Person, The Right Time.</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed hidden sm:block">
            Real-time transparent distribution linking verified donors, on-ground field volunteers, and authentic recipients.
          </p>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="flex-1 px-5 py-5 max-w-md w-full mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selector Tabs */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-4 gap-2">
              {roles.map((item) => {
                const Icon = item.icon;
                const isActive = role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRoleChange(item)}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#0b1329] text-white border-[#0b1329] shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={18} className="mb-1 shrink-0" />
                    <span className="truncate text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email / Username */}
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Email or Username
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <button type="button" className="text-[11px] text-blue-600 font-medium hover:underline">
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#0b1329] hover:bg-slate-900 text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-[0.99] mt-2"
          >
            LOGIN AS {role.toUpperCase()}
          </button>
        </form>

        {/* Demo Credentials Quick Switcher Banner */}
        <div className="mt-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-slate-600">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-blue-900 capitalize">Demo: {role}</span>
            <span className="text-slate-500 font-mono text-[10px]">Password123!</span>
          </div>
          <span className="block text-slate-500 truncate mt-0.5">{email}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="py-3 text-center text-[10px] text-slate-400 border-t border-slate-200/60 bg-white">
        © 2026 Community Care Platform. All rights reserved.
      </div>
    </div>
  );
}
