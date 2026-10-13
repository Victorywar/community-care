import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import OrderTimeline from '../../components/common/OrderTimeline';
import { api } from '../../services/api';
import { Truck, MapPin, CheckCircle2, Clock, Camera, RefreshCw } from 'lucide-react';

export default function VolunteerDashboard({ currentUser, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickupLoc, setPickupLoc] = useState('');
  const [activeAcceptId, setActiveAcceptId] = useState(null);
  const [transitPhoto, setTransitPhoto] = useState('');

  const fetchFleet = async () => {
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

  useEffect(() => { fetchFleet(); }, []);

  const handleAcceptTransit = async (id) => {
    try {
      await api.updateTimelineStep(id, {
        action: 'ACCEPT_VOLUNTEER',
        actor: currentUser?.name || 'Volunteer Runner',
        location: pickupLoc || 'Central Distribution Depot',
        photo: transitPhoto
      });
      setTransitPhoto('');
      setActiveAcceptId(null);
      fetchFleet();
    } catch {
      alert("Error accepting dispatch");
    }
  };

  const handleDeliveryComplete = async (id) => {
    const stars = prompt("Enter verification score (1 to 5 stars):", "5");
    const comment = prompt("Enter delivery feedback / handover notes:", "Handed over safely to receiver");
    try {
      await api.updateTimelineStep(id, {
        action: 'COMPLETE',
        actor: currentUser?.name || 'Volunteer Runner',
        stars: parseInt(stars) || 5,
        comment
      });
      fetchFleet();
    } catch {
      alert("Error completing handover");
    }
  };

  const readyToPick = requests.filter(r => r.status === 'FUNDED');
  const activeDispatches = requests.filter(r => r.status === 'DISPATCHED' && r.volunteerName === currentUser?.name);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <Header currentUser={currentUser} onLogout={onLogout} activeTitle="Volunteer Dispatch Fleet" />

      <main className="max-w-xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-black text-slate-900">Field Transit & Dispatches</h2>
            <p className="text-xs text-slate-400">Accept packages, register pickup depot, and log deliveries</p>
          </div>
          <button onClick={fetchFleet} className="p-2 bg-white border border-slate-200 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Packages Funded & Awaiting Transit */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Ready for Pickup & Transit</h3>
          {readyToPick.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              No packages waiting for volunteer pickup right now.
            </div>
          ) : (
            readyToPick.map(r => (
              <div key={r._id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{r.itemName}</h4>
                    <p className="text-xs text-slate-500">Destination: {r.location}</p>
                    <p className="text-[11px] text-purple-600 font-semibold">Funded by: {r.donorName}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Ready</span>
                </div>

                <OrderTimeline request={r} />

                {activeAcceptId === r._id ? (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-2 text-xs">
                    <label className="font-bold text-blue-900 block">Pickup Depot / Location:</label>
                    <input 
                      value={pickupLoc} 
                      onChange={(e) => setPickupLoc(e.target.value)} 
                      placeholder="e.g. Central Logistics Warehouse" 
                      className="w-full p-2 rounded-lg border border-blue-200 bg-white"
                    />
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setActiveAcceptId(null)} className="flex-1 py-2 font-bold border rounded-lg bg-white">Cancel</button>
                      <button onClick={() => handleAcceptTransit(r._id)} className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg">Accept Transit</button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveAcceptId(r._id)} 
                    className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-4 h-4" /> Accept Transit & Log Pickup Location
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* My In-Transit Deliveries */}
        {activeDispatches.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider">My Active Deliveries</h3>
            {activeDispatches.map(a => (
              <div key={a._id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{a.itemName}</h4>
                    <p className="text-xs text-slate-500">Receiver: {a.recipientName} ({a.location})</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">In Transit</span>
                </div>
                <OrderTimeline request={a} />
                <button 
                  onClick={() => handleDeliveryComplete(a._id)}
                  className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" /> Complete Handover & Sign Off
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}