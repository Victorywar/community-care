import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Check, X, RefreshCw, AlertCircle } from 'lucide-react';

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
      await api.updateRequestStatus(id, 'VERIFIED');
      fetchLive();
    } catch (err) {
      alert("Failed updating status");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-slate-900">Verify Receiver Aid Requests</h2>
        <button onClick={fetchLive} className="p-1.5 bg-white border border-slate-200 rounded-lg">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
          No aid requests submitted yet. Once a receiver submits, it appears here for admin verification.
        </div>
      ) : (
        requests.map((r) => (
          <div key={r._id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-bold text-sm text-slate-800">{r.itemName || r.title}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100">{r.status}</span>
            </div>
            <p className="text-xs text-slate-500">{r.description || 'No description provided'}</p>
            <div className="text-[11px] text-slate-400 flex justify-between pt-2 border-t border-slate-100">
              <span>Qty: {r.quantity || 1}</span>
              <span>Loc: {r.location || 'Local'}</span>
            </div>
            {r.status === 'PENDING' && (
              <div className="pt-2 flex gap-2">
                <button 
                  onClick={() => handleVerify(r._id)}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Approve & Send to Donors
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}