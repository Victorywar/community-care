import React, { useState, useEffect } from 'react';
import { Clock, Truck, CheckCircle, Heart, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboard({ onNavigate }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const verifiedCount = requests.filter(r => r.status === 'VERIFIED' || r.status === 'FUNDED').length;
  const transitCount = requests.filter(r => r.status === 'DISPATCHED' || r.status === 'ASSIGNED').length;
  const completedCount = requests.filter(r => r.status === 'COMPLETED').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Admin Live Control</h2>
          <p className="text-[11px] text-slate-400">Verify receiver requests & coordinate fleet</p>
        </div>
        <button onClick={loadData} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Mobile 2x2 Grid Stats */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40">
          <span className="text-[11px] font-semibold text-amber-700">Need Verification</span>
          <p className="text-2xl font-black text-amber-900 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-purple-200 bg-purple-50/40">
          <span className="text-[11px] font-semibold text-purple-700">Awaiting Donor</span>
          <p className="text-2xl font-black text-purple-900 mt-1">{verifiedCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-blue-200 bg-blue-50/40">
          <span className="text-[11px] font-semibold text-blue-700">In Transit</span>
          <p className="text-2xl font-black text-blue-900 mt-1">{transitCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40">
          <span className="text-[11px] font-semibold text-emerald-700">Completed</span>
          <p className="text-2xl font-black text-emerald-900 mt-1">{completedCount}</p>
        </div>
      </div>

      {/* Live Raw Feed */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Incoming Workflow Pipeline</h3>
        {requests.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
            No active records in MongoDB.
          </div>
        ) : (
          requests.slice(0, 5).map((r) => (
            <div key={r._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-slate-800">{r.itemName || r.title}</p>
                <p className="text-[10px] text-slate-400">{r.recipientName || 'Receiver'} • {r.quantity || 1} units</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200">
                {r.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}