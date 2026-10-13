import React, { useState, useEffect } from 'react';
import OrderTimeline from '../../components/common/OrderTimeline';
import { api } from '../../services/api';
import { CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

export default function HelpRequests() {
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

  const handleApprove = async (id) => {
    try {
      await api.updateTimelineStep(id, {
        action: 'ADMIN_APPROVE',
        actor: 'Admin Control'
      });
      fetchLive();
    } catch {
      alert("Error approving request");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900">Aid Request Audit & Timeline Verification</h2>
          <p className="text-xs text-slate-400">Review receiver requests, accept them, and broadcast to willing donors</p>
        </div>
        <button onClick={fetchLive} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No aid requests in queue</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map(r => (
            <div key={r._id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                  <p className="text-xs text-slate-400">{r.quantity} units • Req by: {r.recipientName}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  r.status === 'PENDING' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                  r.status === 'ACCEPTED' ? 'bg-black text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {r.status}
                </span>
              </div>

              <OrderTimeline request={r} />

              {r.status === 'PENDING' && (
                <button 
                  onClick={() => handleApprove(r._id)}
                  className="w-full py-2.5 bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-slate-800 transition"
                >
                  <CheckCircle className="w-4 h-4" /> Accept & Approve Request to Donors
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}