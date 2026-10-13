import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import OrderTimeline from '../../components/common/OrderTimeline';
import LiveRelayChat from '../admin/LiveRelayChat';
import { api } from '../../services/api';
import { Truck, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VolunteerDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickupLoc, setPickupLoc] = useState('');
  const [activeAcceptId, setActiveAcceptId] = useState(null);

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
        actor: currentUser?.name || 'Volunteer Driver',
        location: pickupLoc || 'Central Distribution Depot'
      });
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
        actor: currentUser?.name || 'Volunteer Driver',
        stars: parseInt(stars) || 5,
        comment
      });
      fetchFleet();
    } catch {
      alert("Error completing handover");
    }
  };

  const readyToPick = requests.filter(r => r.status === 'FUNDED');
  const myDispatches = requests.filter(r => r.status === 'DISPATCHED' && r.volunteerName === currentUser?.name);

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout} activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'home' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-black text-slate-900">Volunteer Dispatch Pipeline</h2>
              <p className="text-xs text-slate-400">Accept funded packages, log pickup depots, and complete deliveries</p>
            </div>
            <button onClick={fetchFleet} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {readyToPick.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No packages ready for volunteer pickup</p>
              <p className="text-xs text-slate-400 mt-1">When donors fund verified aid, transit manifests will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {readyToPick.map(r => (
                <div key={r._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                      <p className="text-xs text-slate-500">Destination: {r.location} • Contributor: {r.donorName}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Ready</span>
                  </div>

                  <OrderTimeline request={r} />

                  {activeAcceptId === r._id ? (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <label className="font-bold text-slate-800 block">Pickup Depot / Location:</label>
                      <input 
                        value={pickupLoc} 
                        onChange={(e) => setPickupLoc(e.target.value)} 
                        placeholder="e.g. Central Warehouse Dock 3" 
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
                      />
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setActiveAcceptId(null)} className="flex-1 py-2 font-bold border rounded-lg bg-white">Cancel</button>
                        <button onClick={() => handleAcceptTransit(r._id)} className="flex-1 py-2 bg-black text-white font-bold rounded-lg">Accept Transit</button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setActiveAcceptId(r._id)} 
                      className="w-full py-2.5 bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-slate-800"
                    >
                      <Truck className="w-4 h-4" /> Accept Transit & Register Pickup Place
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'my-dispatches' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 pb-2 border-b border-slate-200">My Active Deliveries</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {myDispatches.map(a => (
              <div key={a._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{a.itemName}</h3>
                    <p className="text-xs text-slate-500">Receiver: {a.recipientName} ({a.location})</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">In Transit</span>
                </div>
                <OrderTimeline request={a} />
                <button 
                  onClick={() => handleDeliveryComplete(a._id)}
                  className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4" /> Complete Handover & Sign Off
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 pb-2 border-b border-slate-200">Field Transit Timelines</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {requests.map(r => (
              <div key={r._id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                <OrderTimeline request={r} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'chat' && <LiveRelayChat currentUser={currentUser} />}
    </AppLayout>
  );
}