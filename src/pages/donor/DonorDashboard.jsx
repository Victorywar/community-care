import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import { api } from '../../services/api';
import { Heart, Check, RefreshCw } from 'lucide-react';

export default function DonorDashboard({ currentUser, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVerified = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      // Donors see requests verified by Admin
      setRequests(Array.isArray(data) ? data.filter(r => r.status === 'VERIFIED') : []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVerified(); }, []);

  const handleFund = async (id) => {
    try {
      await api.updateRequestStatus(id, 'FUNDED', { donorName: currentUser?.name || 'Donor' });
      fetchVerified();
      alert("Thank you! Request is now assigned for Volunteer delivery.");
    } catch {
      alert("Error processing donation");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 flex flex-col">
      <Header currentUser={currentUser} onLogout={onLogout} activeTitle="Donor Platform" />
      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-slate-900">Verified Aid Needs</h2>
            <p className="text-[11px] text-slate-400">Approved by Admin, awaiting contribution</p>
          </div>
          <button onClick={fetchVerified} className="p-1.5 bg-white border border-slate-200 rounded-lg">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
            No verified requests waiting for donors right now.
          </div>
        ) : (
          requests.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm text-slate-900">{r.itemName}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">Verified by Admin</span>
              </div>
              <p className="text-xs text-slate-500">{r.description || 'Community assistance request'}</p>
              <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                <span>Needed: {r.quantity} units</span>
                <span>Area: {r.location}</span>
              </div>
              <button 
                onClick={() => handleFund(r._id)}
                className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Heart className="w-4 h-4" /> Donate & Fulfill this Need
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  );
}