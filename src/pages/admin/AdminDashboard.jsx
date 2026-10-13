import React, { useState, useEffect } from 'react';
import { Clock, Truck, CheckCircle2, HeartHandshake, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      setRequests(data || []);
    } catch (err) {
      console.warn("Failed fetching live requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = [
    { label: 'Pending Help', count: requests.filter(r => r.status === 'PENDING').length, subtitle: 'Awaiting Assignment', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
    { label: 'Active Dispatches', count: requests.filter(r => r.status === 'ASSIGNED' || r.status === 'DISPATCHED').length, subtitle: 'In Field Transit', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
    { label: 'Fulfilled Aid', count: requests.filter(r => r.status === 'COMPLETED').length, subtitle: 'Signed Off & Verified', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
    { label: 'Total Contributions', count: requests.length, subtitle: 'In Inventory Ledger', icon: HeartHandshake, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Responsive Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{s.label}</span>
                <div className={`p-2 rounded-xl border ${s.bg}`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{s.count}</p>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">{s.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Responsive Feeds */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Live Beneficiary Requests & Milestones</h2>
            <p className="text-xs text-slate-400">Real-time aid registry synced directly with MongoDB</p>
          </div>
          <button 
            onClick={loadData}
            disabled={loading}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">No requests submitted yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">When a recipient registers an aid request, it will immediately propagate here.</p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {requests.map((r, i) => (
              <div key={r._id || i} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-800 text-sm">{r.itemName || 'Urgent Aid'}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                      {r.status || 'PENDING'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{r.description || r.location || 'Local distribution unit'}</p>
                </div>
                <div className="text-left sm:text-right text-xs text-slate-400">
                  <p>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Active now'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}