import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import { api } from '../../services/api';
import { Truck, CheckCircle, MapPin, RefreshCw } from 'lucide-react';

export default function VolunteerDashboard({ currentUser, onLogout }) {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDispatches = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      // Volunteers pick up items funded by Donors
      setDispatches(Array.isArray(data) ? data.filter(r => r.status === 'FUNDED' || r.status === 'DISPATCHED') : []);
    } catch {
      setDispatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDispatches(); }, []);

  const handleComplete = async (id) => {
    try {
      await api.updateRequestStatus(id, 'COMPLETED', { volunteerName: currentUser?.name || 'Volunteer' });
      fetchDispatches();
      alert("Relief successfully delivered and signed off!");
    } catch {
      alert("Error completing dispatch");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 flex flex-col">
      <Header currentUser={currentUser} onLogout={onLogout} activeTitle="Volunteer Fleet" />
      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-slate-900">Active Field Deliveries</h2>
            <p className="text-[11px] text-slate-400">Deliver funded donations directly to receivers</p>
          </div>
          <button onClick={fetchDispatches} className="p-1.5 bg-white border border-slate-200 rounded-lg">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {dispatches.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
            No deliveries ready for pickup right now.
          </div>
        ) : (
          dispatches.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-sm text-slate-900">{r.itemName}</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3" /> {r.location}
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Ready for Delivery</span>
              </div>
              <p className="text-xs text-slate-500">Receiver: <span className="font-semibold text-slate-700">{r.recipientName || 'Recipient'}</span></p>
              <button 
                onClick={() => handleComplete(r._id)}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" /> Mark as Delivered & Signed Off
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  );
}