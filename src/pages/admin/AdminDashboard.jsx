import React from 'react';
import { useData } from '../../context/DataContext';
import { 
  Clock, 
  Truck, 
  CheckCircle2, 
  HeartHandshake, 
  MapPin, 
  Calendar, 
  User, 
  ShieldCheck,
  Package
} from 'lucide-react';

export default function AdminDashboard() {
  const { requests = [], donations = [], receipts = [], loading, refreshAllData } = useData();

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const inProgressCount = requests.filter(r => r.status === 'IN_PROGRESS').length;
  const fulfilledCount = requests.filter(r => r.status === 'FULFILLED').length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Clock size={18} />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Help</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{pendingCount}</p>
          <span className="text-[10px] text-amber-600 font-bold mt-1 block">Awaiting Assignment</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Truck size={18} />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Dispatches</span>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-0.5">{inProgressCount}</p>
          <span className="text-[10px] text-blue-600 font-bold mt-1 block">In Field Transit</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fulfilled Aid</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-0.5">{fulfilledCount}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Signed Off & Verified</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <HeartHandshake size={18} />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Contributions</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{donations.length}</p>
          <span className="text-[10px] text-purple-600 font-bold mt-1 block">In Inventory Ledger</span>
        </div>
      </div>

      {/* Real Queue & Interactive Dispatch Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900">Live Beneficiary Requests & Milestones</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time aid registry synced directly with MongoDB</p>
          </div>
          <button
            onClick={refreshAllData}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Refresh Feed
          </button>
        </div>

        {loading ? (
          <p className="text-center py-10 text-xs text-slate-400">Loading database stream...</p>
        ) : requests.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl text-center">
            <Package size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-500">No requests submitted yet</p>
            <p className="text-[11px] text-slate-400 mt-1">When a Recipient registers an aid ticket, it will appear here instantly.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {req.id}
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{req.title}</h3>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      req.status === 'FULFILLED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      req.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar size={12} /> {req.createdAt}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <User size={13} className="text-slate-400 shrink-0" />
                    <span>Recipient: <strong className="text-slate-800">{req.recipientName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{req.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-blue-500 shrink-0" />
                    <span>Volunteer: <strong className="text-slate-800">{req.assignedVolunteer}</strong></span>
                  </div>
                </div>

                {/* Professional Visual Timeline */}
                <div className="pt-3 border-t border-slate-200/60">
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                    <div className={`p-2 rounded-xl border ${
                      req.status ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <p className="font-black">1. Ticket Created</p>
                      <p className="text-[9px] font-normal text-slate-500 mt-0.5">Logged</p>
                    </div>

                    <div className={`p-2 rounded-xl border ${
                      req.status === 'IN_PROGRESS' || req.status === 'FULFILLED'
                        ? 'bg-blue-50 border-blue-200 text-blue-800'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <p className="font-black">2. Field Transit</p>
                      <p className="text-[9px] font-normal text-slate-500 mt-0.5">
                        {req.status === 'IN_PROGRESS' || req.status === 'FULFILLED' ? req.assignedVolunteer : 'Awaiting Unit'}
                      </p>
                    </div>

                    <div className={`p-2 rounded-xl border ${
                      req.status === 'FULFILLED'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <p className="font-black">3. Handover Done</p>
                      <p className="text-[9px] font-normal text-slate-500 mt-0.5">
                        {req.status === 'FULFILLED' ? 'Verified Receipt' : 'Pending Sign-off'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}