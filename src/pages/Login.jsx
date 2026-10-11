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
    // w-full மற்றும் min-h-screen வழியா screen edge-to-edge full width ஆக்குறோம்
    <div className="min-h-screen w-full bg-[#080d1d] flex flex-col justify-between">
      
      {/* 1. Top Hero Section - No side gaps, 100% full width */}
      <div className="w-full px-5 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-5">
          <Logo size="md" inverted={true} />
        </div>

        {/* Hero Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-inner">
          <h1 className="text-lg font-bold text-white leading-snug">
            Every Contribution <br />
            The Right Person <br />
            The Right Time
          </h1>
          <p className="text-slate-400 text-xs mt-2.5 leading-relaxed">
            Real-time transparent distribution linking verified donors, on-ground field volunteers, and authentic recipients.
          </p>
        </div>

        <p className="text-[11px] text-slate-500 mt-3 px-1">
          © 2026 Community Care Platform. All rights reserved.
        </p>
      </div>

      {/* 2. White Form Section - Edge to Edge, rounded top */}
      <div className="w-full bg-white rounded-t-3xl px-6 pt-6 pb-8 shadow-2xl flex-1 flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* SELECT ROLE */}
          <div>
            <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
              SELECT ROLE
            </label>
            <div className="grid grid-cols-4 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0b1329] text-white border-[#0b1329] shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={18} className="mb-1 shrink-0" />
                    <span className="text-[11px] truncate w-full text-center">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email or Username */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Email or username
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 pr-9 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <div className="text-right mt-1">
              <span className="text-[11px] text-blue-600 cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-[#0b1329] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer mt-2"
          >
            LOGIN AS {role}
          </button>
        </form>

        {/* Credentials Info */}
        <div className="mt-4 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">Quick Login:</span>
          <p className="truncate mt-0.5">
            <strong className="text-slate-700">{role}:</strong> {email}
          </p>
        </div>
      </div>

    </div>
  );
}