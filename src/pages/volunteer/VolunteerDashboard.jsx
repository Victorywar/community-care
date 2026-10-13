import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import OrderTimeline from '../../components/common/OrderTimeline';
import LiveRelayChat from '../admin/LiveRelayChat';
import { api } from '../../services/api';
import { 
  Truck, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  Award
} from 'lucide-react';

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
        actor: currentUser?.name || 'Volunteer Runner',
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
  const myDispatches = requests.filter(r => r.status === 'DISPATCHED' && r.volunteerName === currentUser?.name);
  const myCompleted = requests.filter(r => r.status === 'COMPLETED' && r.volunteerName === currentUser?.name);
  const allAttended = requests.filter(r => r.volunteerName === currentUser?.name);

  const volunteerCards = [
    { label: 'Available Jobs', count: readyToPick.length, sub: 'Awaiting pickup', icon: Package, bg: 'bg-blue-50 text-blue-800', border: 'border-blue-200' },
    { label: 'In My Transit', count: myDispatches.length, sub: 'Currently moving', icon: Truck, bg: 'bg-amber-50 text-amber-800', border: 'border-amber-200' },
    { label: 'Deliveries Done', count: myCompleted.length, sub: 'Completed handovers', icon: CheckCircle2, bg: 'bg-emerald-50 text-emerald-800', border: 'border-emerald-200' },
    { label: 'Hero Rating', count: '5.0 ★', sub: 'Fleet performance', icon: Award, bg: 'bg-black text-white', border: 'border-slate-800' }
  ];

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout} activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'home' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Volunteer Mission Control</h1>
              <p className="text-xs text-slate-500 font-medium">Claim manifests, handle field dispatches, and review client deliveries</p>
            </div>
            <button onClick={fetchFleet} className="p-2.5 bg-black text-white rounded-xl hover:bg-slate-800 transition">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {volunteerCards.map((c, idx) => {
              const Icon = c.icon;
              return (
                <div key={idx} className={`p-4 rounded-2xl border ${c.border} ${c.bg} shadow-xs flex flex-col justify-between`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">{c.label}</span>
                    <Icon className="w-4 h-4 opacity-75" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black tracking-tight">{c.count}</p>
                    <p className="text-[10px] opacity-75 font-medium mt-0.5">{c.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Boxes for Available Pickups */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Funded Aid Ready For Pickup</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                {readyToPick.length} Available
              </span>
            </div>

            {readyToPick.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                <AlertCircle className="w-7 h-7 mx-auto mb-2 text-slate-300" />
                No aid packages waiting for pickup right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readyToPick.map(r => (
                  <div key={r._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                        <p className="text-xs text-slate-500">Destination: {r.location} • Donor: {r.donorName}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Ready</span>
                    </div>

                    <OrderTimeline request={r} />

                    {activeAcceptId === r._id ? (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                        <label className="font-bold text-slate-800 block">Pickup Depot / Location:</label>
                        <input 
                          value={pickupLoc} 
                          onChange={(e) => setPickupLoc(e.target.value)} 
                          placeholder="e.g. Central Warehouse Dock 3" 
                          className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none"
                        />
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => setActiveAcceptId(null)} className="flex-1 py-2 font-bold border rounded-lg bg-slate-100">Cancel</button>
                          <button onClick={() => handleAcceptTransit(r._id)} className="flex-1 py-2 bg-black text-white font-bold rounded-lg">Confirm Transit</button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setActiveAcceptId(r._id)} 
                        className="w-full py-2.5 bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-slate-800"
                      >
                        <Truck className="w-4 h-4" /> Accept Transit & Register Depot
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Table Container with Rows & Columns */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Attended Deliveries & Field Runs Table</h2>
                <p className="text-[11px] text-slate-400">All requisitions claimed and delivered by your volunteer account</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                {allAttended.length} Runs
              </span>
            </div>

            {allAttended.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                You have not claimed any deliveries yet. Accept jobs above to begin!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50">
                      <th className="py-3 px-3">Req ID</th>
                      <th className="py-3 px-3">Recipient Name</th>
                      <th className="py-3 px-3">Item & Qty</th>
                      <th className="py-3 px-3">Donor Name</th>
                      <th className="py-3 px-3">Delivery Location</th>
                      <th className="py-3 px-3">Status / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {allAttended.map((a) => (
                      <tr key={a._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-3 font-mono text-[11px] font-bold text-slate-500">
                          #{a._id?.slice(-5)}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">{a.recipientName}</td>
                        <td className="py-3.5 px-3">{a.itemName} ({a.quantity} units)</td>
                        <td className="py-3.5 px-3 text-purple-700 font-semibold">{a.donorName}</td>
                        <td className="py-3.5 px-3 text-slate-500">{a.location}</td>
                        <td className="py-3.5 px-3">
                          {a.status === 'COMPLETED' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> Delivered ({a.reviewStars}★)
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleDeliveryComplete(a._id)}
                              className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] hover:bg-emerald-700"
                            >
                              Complete Handover
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'chat' && <LiveRelayChat currentUser={currentUser} />}
    </AppLayout>
  );
}