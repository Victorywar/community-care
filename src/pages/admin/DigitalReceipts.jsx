import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import OrderTimeline from '../../components/common/OrderTimeline';
import { Receipt, CheckCircle, RefreshCw, AlertCircle, FileText } from 'lucide-react';

export default function DigitalReceipts() {
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      // Zero mock data. Strictly records with status COMPLETED.
      setCompleted(Array.isArray(data) ? data.filter(r => r.status === 'COMPLETED') : []);
    } catch {
      setCompleted([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReceipts(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900">Digital Handover Receipts</h2>
          <p className="text-xs text-slate-400">Authenticated delivery receipts generated from actual completed handovers</p>
        </div>
        <button onClick={fetchReceipts} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {completed.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No completed receipts in database yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            When a volunteer hands over aid and signs off on a request, an authentic digitally signed voucher will automatically generate here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {completed.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-black text-white shrink-0">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm font-mono">RCP-{r._id.slice(-6).toUpperCase()}</h3>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Signed</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">{r.itemName} ({r.quantity} units)</p>
                    <p className="text-xs text-slate-400">Receiver: {r.recipientName} • Location: {r.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 text-xs">
                  <span className="text-slate-400">{r.completedAt ? new Date(r.completedAt).toLocaleDateString() : 'Delivered'}</span>
                  <button 
                    onClick={() => setSelectedReceipt(selectedReceipt === r._id ? null : r._id)}
                    className="px-3 py-1.5 rounded-xl bg-black text-white hover:bg-slate-800 font-semibold inline-flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> {selectedReceipt === r._id ? 'Hide Timeline' : 'View Voucher'}
                  </button>
                </div>
              </div>

              {selectedReceipt === r._id && (
                <div className="pt-2 border-t border-slate-100 animate-in fade-in">
                  <OrderTimeline request={r} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}