import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import OrderTimeline from '../../components/common/OrderTimeline';
import { 
  Clock, 
  CheckCircle2, 
  Truck, 
  Heart, 
  RefreshCw, 
  AlertCircle, 
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  PackageCheck
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLive = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLive(); }, []);

  const total = requests.length;
  const pending = requests.filter(r => r.status === 'PENDING').length;
  const verified = requests.filter(r => r.status === 'VERIFIED').length;
  const inTransit = requests.filter(r => r.status === 'DISPATCHED' || r.status === 'FUNDED').length;
  const completed = requests.filter(r => r.status === 'COMPLETED').length;

  const cards = [
    { label: 'Total Aid Requests', count: total, sub: 'All-time pipeline', icon: TrendingUp, bg: 'bg-black text-white', border: 'border-slate-800' },
    { label: 'Awaiting Audit', count: pending, sub: 'Needs admin sign-off', icon: Clock, bg: 'bg-amber-50 text-amber-700', border: 'border-amber-200' },
    { label: 'Ready for Donors', count: verified, sub: 'Verified by Admin', icon: Heart, bg: 'bg-purple-50 text-purple-700', border: 'border-purple-200' },
    { label: 'Active in Transit', count: inTransit, sub: 'Field fleet moving', icon: Truck, bg: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
    { label: 'Aid Delivered', count: completed, sub: 'Verified & Reviewed', icon: CheckCircle2, bg: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Admin Command Center</h1>
          <p className="text-xs text-slate-500 font-medium">Real-time aid registry, fleet telemetry & verification pipeline</p>
        </div>
        <button 
          onClick={fetchLive}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className={`p-4 rounded-2xl border ${c.border} ${c.bg} shadow-xs flex flex-col justify-between transition-transform active:scale-95`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold opacity-80 uppercase tracking-wider">{c.label}</span>
                <Icon className="w-4 h-4 opacity-75" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black tracking-tight">{c.count}</p>
                <p className="text-[10px] opacity-75 font-medium mt-0.5">{c.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Navigator Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button onClick={() => onNavigate && onNavigate('requests')} className="p-3 bg-white border border-slate-200 rounded-xl text-left hover:border-black transition">
          <p className="font-bold text-xs text-slate-900 flex items-center justify-between">Verify Needs <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" /></p>
          <p className="text-[10px] text-slate-400 mt-0.5">{pending} items pending</p>
        </button>
        <button onClick={() => onNavigate && onNavigate('donations')} className="p-3 bg-white border border-slate-200 rounded-xl text-left hover:border-black transition">
          <p className="font-bold text-xs text-slate-900 flex items-center justify-between">Donation Ledger <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" /></p>
          <p className="text-[10px] text-slate-400 mt-0.5">Track contributions</p>
        </button>
        <button onClick={() => onNavigate && onNavigate('dispatch')} className="p-3 bg-white border border-slate-200 rounded-xl text-left hover:border-black transition">
          <p className="font-bold text-xs text-slate-900 flex items-center justify-between">Field Fleet <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" /></p>
          <p className="text-[10px] text-slate-400 mt-0.5">{inTransit} active runs</p>
        </button>
        <button onClick={() => onNavigate && onNavigate('receipts')} className="p-3 bg-white border border-slate-200 rounded-xl text-left hover:border-black transition">
          <p className="font-bold text-xs text-slate-900 flex items-center justify-between">Digital Receipts <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" /></p>
          <p className="text-[10px] text-slate-400 mt-0.5">{completed} signed vouchers</p>
        </button>
      </div>

      {/* Live Pipeline Feed with Visual Timelines */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Live Active Requisition Pipeline</h2>
            <p className="text-[11px] text-slate-400">Chronological feed of items progressing through community stages</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
            {requests.length} items logged
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No aid requisitions recorded in the database yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.slice(0, 6).map(r => (
              <div key={r._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                    <p className="text-[11px] text-slate-400">{r.quantity} units • Recipient: {r.recipientName}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                    {r.status}
                  </span>
                </div>
                <OrderTimeline request={r} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}