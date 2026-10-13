import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import OrderTimeline from '../../components/common/OrderTimeline';
import { Heart, RefreshCw, AlertCircle, FileText } from 'lucide-react';

export default function DonationManagement() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTimeline, setActiveTimeline] = useState(null);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      // Zero dummy names. Strictly requests funded by real donors.
      setDonations(Array.isArray(data) ? data.filter(r => r.donorName && r.status !== 'PENDING') : []);
    } catch {
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900">Donation & Supply Ledger</h2>
          <p className="text-xs text-slate-400">Live registry of community-funded relief provisions</p>
        </div>
        <button onClick={fetchDonations} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {donations.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No donor contributions recorded yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            When donors login and fund verified aid requisitions, their contributions and item allocations will appear here live.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((d) => (
            <div key={d._id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-black text-white shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{d.itemName} ({d.quantity} units)</h3>
                      <span className="text-[10px] text-slate-400 font-mono">(ID: #{d._id.slice(-5)})</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Contributor: <span className="font-bold text-slate-800">{d.donorName}</span></p>
                    <p className="text-xs text-slate-400">Intended for: {d.recipientName} • {d.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                    {d.status}
                  </span>
                  <button 
                    onClick={() => setActiveTimeline(activeTimeline === d._id ? null : d._id)}
                    className="px-3 py-1.5 rounded-xl bg-black text-white hover:bg-slate-800 font-semibold inline-flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> {activeTimeline === d._id ? 'Hide' : 'Timeline'}
                  </button>
                </div>
              </div>

              {activeTimeline === d._id && (
                <div className="pt-2 border-t border-slate-100 animate-in fade-in">
                  <OrderTimeline request={d} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}