import React, { useState } from 'react';
import Logo from '../components/common/Logo';
import { ShieldCheck, HeartHandshake, Truck, User, Eye, EyeOff, Lock, Mail } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-[#f8faff] flex flex-col justify-between items-center p-4 sm:p-6 text-slate-800">
      
      {/* Top Header Logo */}
      <div className="w-full max-w-sm flex items-center justify-start pt-3 sm:pt-6">
        <Logo size="md" inverted={false} showText={true} />
      </div>

      {/* Center Floating Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8 my-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111836] tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            Relief & dispatch console access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selector Badges */}
          <div>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100">
              {roles.map((r) => {
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer truncate ${
                      isSelected
                        ? 'bg-[#121a36] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email / Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Email or Username
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@communitycare.org"
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#f9fafc] border border-slate-200/90 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#121a36] focus:ring-1 focus:ring-[#121a36] transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm bg-[#f9fafc] border border-slate-200/90 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#121a36] focus:ring-1 focus:ring-[#121a36] transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="text-right pt-1">
              <span className="text-xs font-bold text-[#121a36] hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>
          </div>

          {/* Dark Login Button */}
          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-[#121a36] hover:bg-[#1c274f] text-white font-bold text-sm rounded-2xl shadow-md shadow-slate-900/10 active:scale-[0.99] transition-all cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>

      {/* Footer Text */}
      <div className="pb-3 text-center">
        <p className="text-[11px] font-medium tracking-[0.2em] text-slate-400 uppercase">
          © 2026 Community Care Platform
        </p>
      </div>

    </div>
  );
}