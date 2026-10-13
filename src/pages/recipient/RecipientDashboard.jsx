import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import { api } from '../../services/api';
import { PlusCircle, Send, Clock, CheckCircle } from 'lucide-react';

export default function RecipientDashboard({ currentUser, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('1');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = async () => {
    try {
      const data = await api.getRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setRequests([]);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.trim()) return;
    setSubmitting(true);
    try {
      await api.createRequest({
        itemName: item,
        quantity: parseInt(qty) || 1,
        description: desc,
        location: location || 'Field Sector',
        recipientName: currentUser?.name || 'Receiver',
        status: 'PENDING'
      });
      setItem(''); setDesc(''); setLocation('');
      setShowModal(false);
      loadRequests();
    } catch (err) {
      alert("Error submitting request. Is backend running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 flex flex-col">
      <Header currentUser={currentUser} onLogout={onLogout} activeTitle="Receiver Platform" />
      
      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-4">
        <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-sm space-y-2">
          <h2 className="font-bold text-sm">Need Relief or Food Aid?</h2>
          <p className="text-xs text-blue-100">Submit a fresh request directly to the community dispatch team.</p>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full py-2.5 bg-white text-blue-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" /> Request Food or Essentials
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">My Relief Requests</h3>
          {requests.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              You haven't requested any aid yet. Tap the button above to request.
            </div>
          ) : (
            requests.map((r) => (
              <div key={r._id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm text-slate-900">{r.itemName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    r.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{r.description || 'Requested items'}</p>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                  <span>Units: {r.quantity}</span>
                  <span>{r.status === 'PENDING' ? 'Waiting for Admin verification' : 'In Workflow Pipeline'}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-3">
            <div className="bg-white w-full max-w-sm rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-sm text-slate-900">New Aid Request</h3>
              <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Item Required (e.g., Food Box, Rice, Water)</label>
                  <input required value={item} onChange={(e) => setItem(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200" placeholder="Rice 10kg, Food Pack..." />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Quantity</label>
                  <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200" />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Your Delivery Address / Location</label>
                  <input required value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200" placeholder="Ward 4, North Camp..." />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Urgent Notes</label>
                  <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200" placeholder="Any specific requirements..."></textarea>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold">{submitting ? 'Submitting...' : 'Submit Request'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}