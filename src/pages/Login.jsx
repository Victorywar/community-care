import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Truck, 
  UserCheck, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import Logo from '../components/common/Logo';

export default function Login() {
  const { login } = useAuth();

  const [role, setRole] = useState('ADMIN');
  const [email, setEmail] = useState(DEMO_CREDENTIALS.ADMIN.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.ADMIN.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    setEmail(DEMO_CREDENTIALS[selectedRole].email);
    setPassword(DEMO_CREDENTIALS[selectedRole].password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await login(email, password, role);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during authentication. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row font-sans bg-white overflow-hidden">
      
      {/* ========================================================
          LEFT PANEL: Dark Navy Blue Branding (50% Width)
          ======================================================== */}
      <div className="w-full md:w-1/2 bg-[#0b1329] text-white flex flex-col justify-between p-8 lg:p-14 select-none h-full">
        <div>
          <Logo size="lg" inverted={true} showText={true} />
        </div>

        <div className="my-auto">
          <div className="bg-[#121c38] border border-slate-700/60 rounded-2xl p-8 lg:p-10 max-w-lg shadow-xl">
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight space-y-2">
              <span className="block">Every Contribution</span>
              <span className="block">The Right Person</span>
              <span className="block">The Right Time</span>
            </h2>
            <p className="mt-4 text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
              Real-time transparent distribution linking verified donors, on-ground field volunteers, and authentic recipients.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} Community Care Platform. All rights reserved.
        </div>
      </div>

      {/* ========================================================
          RIGHT PANEL: Large Form Filling White Space Properly
          ======================================================== */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 h-full overflow-hidden">
        <div className="w-full max-w-xl mx-auto space-y-4">
          
          {/* Header */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Login
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Sign in with your email and password ({role.charAt(0) + role.slice(1).toLowerCase()} Portal)
            </p>
          </div>

          {/* Role Switching Selector Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-4 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleSelectRole('ADMIN')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'ADMIN'
                    ? 'bg-[#0b1329] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <ShieldCheck size={18} className="mb-1" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('DONOR')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'DONOR'
                    ? 'bg-[#0b1329] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <HeartHandshake size={18} className="mb-1" />
                <span>Donor</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('VOLUNTEER')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'VOLUNTEER'
                    ? 'bg-[#0b1329] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Truck size={18} className="mb-1" />
                <span>Volunteer</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('RECEIVER')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'RECEIVER'
                    ? 'bg-[#0b1329] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <UserCheck size={18} className="mb-1" />
                <span>Receiver</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form with Wider Inputs */}
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email or username
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email or username"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 pr-11 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#forgot" className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                Forgot Password?
              </a>
            </div>

            {/* Solid Dark Navy Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl bg-[#0b1329] hover:bg-[#152244] text-white text-sm font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-60"
            >
              {submitting ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>

          {/* Quick Sign In Helper Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-800 text-xs">Sign in</p>
            <p className="text-slate-600 text-xs truncate">
              <span className="font-semibold text-slate-800">{role}:</span> {email}
            </p>
            <p className="text-slate-600 text-xs">
              Password: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px] font-semibold">Password123!</code>
            </p>
            <p className="text-[11px] text-slate-500 pt-0.5">
              Select any role above to automatically load demo credentials for testing.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}