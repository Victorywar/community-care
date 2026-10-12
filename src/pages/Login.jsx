import React, { useState } from 'react';
import Logo from '../components/common/Logo';
import { ShieldCheck, HeartHandshake, Truck, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState('ADMIN');
  const [email, setEmail] = useState('admin@communitycare.org');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { id: 'ADMIN', label: 'Admin', icon: ShieldCheck, email: 'admin@communitycare.org' },
    { id: 'DONOR', label: 'Donor', icon: HeartHandshake, email: 'donor@communitycare.org' },
    { id: 'VOLUNTEER', label: 'Volunteer', icon: Truck, email: 'volunteer@communitycare.org' },
    { id: 'RECEIVER', label: 'Receiver', icon: User, email: 'receiver@communitycare.org' },
  ];

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole.id);
    setEmail(selectedRole.email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, role);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#080d1d]">
      
      {/* 1. LEFT SIDE: Dark Navy Blue Branding Section */}
      <div className="w-full md:w-1/2 min-h-[340px] md:min-h-screen bg-[#080d1d] p-6 sm:p-10 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <Logo size="lg" inverted={true} />
            <div>
              <span className="text-xl font-black text-white tracking-tight">CommunityCare</span>
              <p className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">RELIEF & DISPATCH</p>
            </div>
          </div>

          <div className="mt-8 md:mt-20 bg-[#0f172a]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Every Contribution, <br />
              <span className="text-blue-400">The Right Person,</span> <br />
              The Right Time.
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-4 leading-relaxed max-w-md">
              Real-time transparent distribution linking verified donors, on-ground field volunteers, and authentic recipients.
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-6 md:mt-0 font-medium">
          © 2026 Community Care Platform. All rights reserved.
        </p>
      </div>

      {/* 2. RIGHT SIDE: Clean White Login Form */}
      <div className="w-full md:w-1/2 min-h-screen bg-white rounded-t-3xl md:rounded-t-none flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10 shadow-2xl">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-xs text-slate-500 mt-1">Select your access role and sign in to the console</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* SELECT ROLE */}
            <div>
              <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
                SELECT ROLE
              </label>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#080d1d] text-white border-[#080d1d] shadow-md scale-102'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={18} className="mb-1.5 shrink-0" />
                      <span className="text-[11px] truncate w-full text-center">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Email or username
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="text-right mt-1.5">
                <span className="text-xs text-blue-600 hover:underline cursor-pointer font-medium">
                  Forgot Password?
                </span>
              </div>
            </div>

            {/* LOGIN SUBMIT */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#080d1d] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-[0.99] cursor-pointer"
            >
              LOGIN AS {role}
            </button>
          </form>

          {/* Quick Credential Hint */}
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">{role}:</span> {email}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
              Ready
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}