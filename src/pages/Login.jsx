import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import { 
  ShieldCheck, 
  Heart, 
  Truck, 
  HelpCircle, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function Login() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const roles = [
    { id: 'ADMIN', label: 'Admin', icon: ShieldCheck, desc: 'Command & Dispatch' },
    { id: 'DONOR', label: 'Donor', icon: Heart, desc: 'Contributions & Ledger' },
    { id: 'VOLUNTEER', label: 'Volunteer', icon: Truck, desc: 'Field Operations' },
    { id: 'RECEIVER', label: 'Recipient', icon: HelpCircle, desc: 'Relief Requests' }
  ];

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    setErrorMessage('');
    setSuccessMessage('');
    if (roleId === 'ADMIN') {
      setIsRegister(false);
      setFormData((prev) => ({ ...prev, email: 'admin', password: 'admin@1234' }));
    } else {
      setFormData((prev) => ({ ...prev, email: '', password: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isRegister && selectedRole !== 'ADMIN') {
        const payload = {
          ...formData,
          role: selectedRole
        };
        const res = await register(payload);
        if (res.success) {
          if (selectedRole === 'VOLUNTEER') {
            setSuccessMessage('Registration submitted! Volunteer accounts require Administrator approval before logging in.');
            setIsRegister(false);
          } else {
            setSuccessMessage('Account created successfully! You are now logged in.');
          }
        } else {
          setErrorMessage(res.message || 'Registration failed. Please check your details.');
        }
      } else {
        const res = await login(formData.email, formData.password, selectedRole);
        if (!res.success) {
          setErrorMessage(res.message || 'Invalid credentials.');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Branding Panel */}
        <div className="bg-[#080d1d] p-8 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <Logo size="md" inverted={true} showText={true} />
            <div className="mt-12 space-y-4">
              <h1 className="text-2xl font-black tracking-tight leading-snug">
                Transparent & Direct Community Relief
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect donors, verified field units, and community members in need with verifiable dispatch tracking and immutable impact receipts.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Role-Based Access Control</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 size={16} className="text-blue-400" />
              <span>Real-Time Audit Trail Logging</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {selectedRole === 'ADMIN'
                    ? 'Admin Access Console'
                    : isRegister
                    ? 'Create Your Account'
                    : 'Welcome Back'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedRole === 'ADMIN'
                    ? 'Authorized personnel only'
                    : isRegister
                    ? 'Register to start coordinating'
                    : 'Sign in to access your portal'}
                </p>
              </div>

              {selectedRole !== 'ADMIN' && (
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  {isRegister ? 'Already registered? Log in' : 'New here? Register'}
                </button>
              )}
            </div>

            {/* Role Chips */}
            <div className="mt-5 space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleChange(r.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-[#080d1d] bg-[#080d1d] text-white shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <Icon size={16} className={isSelected ? 'text-amber-400' : 'text-slate-400'} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-none">{r.label}</p>
                        <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                          {r.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alerts */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs font-medium">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-emerald-700 text-xs font-medium">
                <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              {isRegister && selectedRole !== 'ADMIN' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon size={15} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {selectedRole === 'ADMIN' ? 'Admin Username' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === 'ADMIN' ? 'admin' : 'name@example.com'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {isRegister && selectedRole !== 'ADMIN' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Mobile contact"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Ward / Address</label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ward 4, Gandhi Nagar"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-[#080d1d] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <span>
                  {loading 
                    ? 'Authenticating...' 
                    : isRegister 
                      ? `Register as ${roles.find(r => r.id === selectedRole)?.label}`
                      : `Log In as ${roles.find(r => r.id === selectedRole)?.label}`
                  }
                </span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

          {/* Quick Credential Helper */}
          <div className="pt-4 border-t border-slate-100 text-center">
            {selectedRole === 'ADMIN' ? (
              <p className="text-[11px] text-slate-500 font-semibold">
                Admin Credentials: <span className="font-mono text-slate-800">admin</span> / <span className="font-mono text-slate-800">admin@1234</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                New donors, volunteers, and recipients must register their account first.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}