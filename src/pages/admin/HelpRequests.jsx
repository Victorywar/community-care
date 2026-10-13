import React, { useState, useEffect } from 'react';
import OrderTimeline from '../../components/common/OrderTimeline';
import { api } from '../../services/api';
import { Check, RefreshCw } from 'lucide-react';

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

  const handleVerify = async (id) => {
    try {
      await api.updateTimelineStep(id, {
        action: 'VERIFY',
        actor: 'Admin Auditor'
      });
      fetchLive();
    } catch {
      alert("Error verifying");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900">Aid Request Audit & Timeline Verification</h2>
          <p className="text-xs text-slate-400">Verify incoming requests to publish them onto the Donor Ledger</p>
        </div>
        <button onClick={fetchLive} className="p-2 bg-white border border-slate-200 rounded-xl">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map(r => (
          <div key={r._id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                <p className="text-xs text-slate-400">{r.quantity} units • Req by: {r.recipientName}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100">{r.status}</span>
            </div>

            <OrderTimeline request={r} />

            {r.status === 'PENDING' && (
              <button 
                onClick={() => handleVerify(r._id)}
                className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs hover:bg-emerald-700"
              >
                <Check className="w-4 h-4" /> Verify Request & Notify Donors
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}