import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import OrderTimeline from '../../components/common/OrderTimeline';
import { 
  Truck, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  RotateCw, 
  Camera, 
  ShieldAlert, 
  Award, 
  User, 
  Check, 
  Send,
  Navigation
} from 'lucide-react';
import { api } from '../../services/api';

export default function VolunteerDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Status Action Modals / Forms
  const [selectedTask, setSelectedTask] = useState(null);
  const [actionStage, setActionStage] = useState('');
  const [stageNote, setStageNote] = useState('');
  const [proofPhoto, setProofPhoto] = useState('');
  const [reportedIssue, setReportedIssue] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn("Using local cache");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProofPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  // Volunteer Accepts Pickup
  const handleAcceptDonation = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/volunteer/accept/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          volunteerId: currentUser?._id || 'u-vol-1',
          volunteerName: currentUser?.name || 'Karthik Raja'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to accept task');
        return;
      }
      alert('Task accepted! You are now assigned to this delivery.');
      fetchTasks();
      setActiveTab('assigned');
    } catch {
      alert('Network error accepting assignment');
    }
  };

  // Progress Stage Transition
  const handleStageTransition = async () => {
    if (!selectedTask || !actionStage) return;
    try {
      const res = await fetch(`http://localhost:5000/api/volunteer/stage/${selectedTask._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: actionStage,
          actorName: currentUser?.name || 'Karthik Raja',
          note: stageNote,
          proofPhoto,
          issue: reportedIssue
        })
      });
      if (res.ok) {
        alert(`Status updated to ${actionStage}!`);
        setSelectedTask(null);
        setActionStage('');
        setStageNote('');
        setProofPhoto('');
        setReportedIssue('');
        fetchTasks();
      }
    } catch {
      alert('Error updating status');
    }
  };

  // Filtering rules
  const availableToPick = requests.filter(r => r.status === 'AWAITING_VOLUNTEER' || (!r.volunteerId && r.status === 'PUBLISHED'));
  const myVolunteerName = currentUser?.name || 'Karthik Raja';
  const myAssignedTasks = requests.filter(r => r.volunteerName === myVolunteerName || r.volunteerId === currentUser?._id);
  
  const inProgressTasks = myAssignedTasks.filter(r => ['VOLUNTEER_ASSIGNED', 'PICKUP_SCHEDULED', 'COLLECTED', 'IN_TRANSIT'].includes(r.status));
  const completedTasks = myAssignedTasks.filter(r => r.status === 'COMPLETED' || r.status === 'DELIVERED');
  const inTransitCount = myAssignedTasks.filter(r => r.status === 'IN_TRANSIT').length;

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout} activeTab={activeTab} onSelectTab={setActiveTab}>
      <div className="space-y-6 pb-12">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Volunteer Mission Control</h1>
            <p className="text-xs text-slate-500 font-medium">Coordinate supply pickups, deliver community provisions & log proof</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('available')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-xs transition"
            >
              <Package className="w-3.5 h-3.5" /> Find Open Donations
            </button>
            <button 
              onClick={fetchTasks}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              title="Refresh Telemetry"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1. Summary Cards with Real Database Counts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div 
            onClick={() => setActiveTab('available')} 
            className="p-4 rounded-2xl border border-purple-200 bg-purple-50 text-purple-900 shadow-xs cursor-pointer hover:border-purple-300 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Available Donations</span>
              <Package className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight">{availableToPick.length}</p>
            <p className="text-[10px] text-purple-600 font-medium mt-0.5">Awaiting volunteer pickup</p>
          </div>

          <div 
            onClick={() => setActiveTab('assigned')} 
            className="p-4 rounded-2xl border border-slate-800 bg-black text-white shadow-xs cursor-pointer hover:bg-slate-900 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">My Assigned Tasks</span>
              <Truck className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight">{myAssignedTasks.length}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Under your coordination</p>
          </div>

          <div 
            onClick={() => setActiveTab('tracking')} 
            className="p-4 rounded-2xl border border-blue-200 bg-blue-50 text-blue-900 shadow-xs cursor-pointer hover:border-blue-300 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">In Transit</span>
              <Navigation className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight">{inTransitCount}</p>
            <p className="text-[10px] text-blue-600 font-medium mt-0.5">En route to receivers</p>
          </div>

          <div 
            onClick={() => setActiveTab('completed')} 
            className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-900 shadow-xs cursor-pointer hover:border-emerald-300 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Completed Handovers</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight">{completedTasks.length}</p>
            <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Safe delivery verified</p>
          </div>
        </div>

        {/* 2. TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Active Task in Progress Highlight */}
            {inProgressTasks.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <h2 className="text-sm font-bold text-slate-900">Immediate Action Task</h2>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                    {inProgressTasks[0].status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-xs">
                    <p className="text-base font-black text-slate-900">{inProgressTasks[0].title || inProgressTasks[0].itemName}</p>
                    <p className="text-slate-500">{inProgressTasks[0].quantity} {inProgressTasks[0].unit || 'units'} • Category: {inProgressTasks[0].category || 'General'}</p>
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                      <p className="flex items-center gap-1.5 font-bold text-slate-700"><MapPin className="w-3.5 h-3.5 text-rose-500" /> Pickup: {inProgressTasks[0].pickupAddress || inProgressTasks[0].location}</p>
                      <p className="flex items-center gap-1.5 font-bold text-slate-700"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> Delivery: {inProgressTasks[0].deliveryAddress || 'Central Redistribution Point'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between space-y-3">
                    <OrderTimeline request={inProgressTasks[0]} />
                    <button 
                      onClick={() => { setSelectedTask(inProgressTasks[0]); setActionStage('COLLECTED'); }}
                      className="w-full py-2.5 bg-black text-white font-bold rounded-xl text-xs hover:bg-slate-800 shadow-sm"
                    >
                      Update Delivery Status / Upload Proof
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Available List */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Nearby Donations Ready For Pickup</h3>
                <span className="text-[10px] font-bold text-purple-700">{availableToPick.length} Open</span>
              </div>
              {availableToPick.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No unassigned donations right now. Check back shortly!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableToPick.map(t => (
                    <div key={t._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-sm text-slate-900">{t.itemName}</h4>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">{t.category}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{t.quantity} {t.unit || 'units'} • Donor: {t.donorName}</p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {t.pickupAddress || t.location}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleAcceptDonation(t._id)}
                        className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-xs"
                      >
                        Accept Donation Pickup
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. TAB: AVAILABLE DONATIONS */}
        {activeTab === 'available' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Available Community Donations</h2>
              <p className="text-xs text-slate-400">Claim pending items posted by donors to coordinate pickup & distribution</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableToPick.map(d => (
                <div key={d._id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">{d.category || 'General'}</span>
                    <h3 className="font-black text-sm text-slate-900 mt-2">{d.title || d.itemName}</h3>
                    <p className="text-xs text-slate-500 mt-1">{d.description || 'Verified relief donation.'}</p>
                    <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 mt-3 text-[11px]">
                      <p className="text-slate-700 font-semibold">Quantity: <span className="font-bold">{d.quantity} units</span></p>
                      <p className="text-slate-700 font-semibold">Pickup: <span className="font-normal text-slate-500">{d.pickupAddress || d.location}</span></p>
                      <p className="text-slate-700 font-semibold">Donor: <span className="font-normal text-slate-500">{d.donorName}</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAcceptDonation(d._id)}
                    className="w-full py-2.5 bg-black text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
                  >
                    Volunteer for Pickup
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TAB: MY ASSIGNED TASKS */}
        {activeTab === 'assigned' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">My Assigned Tasks Ledger</h2>
                <p className="text-xs text-slate-400">All pickups and deliveries currently registered under your account</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">{myAssignedTasks.length} Total</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50">
                    <th className="py-3 px-3">Task ID</th>
                    <th className="py-3 px-3">Item / Category</th>
                    <th className="py-3 px-3">Locations</th>
                    <th className="py-3 px-3">Current Status</th>
                    <th className="py-3 px-3">Timeline Progress</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {myAssignedTasks.map(t => (
                    <tr key={t._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-500">#{t._id?.slice(-5) || t._id}</td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 block">{t.itemName}</span>
                        <span className="text-[10px] text-purple-700 font-semibold">{t.quantity} units • {t.category}</span>
                      </td>
                      <td className="py-3.5 px-3 text-[11px]">
                        <span className="block text-slate-700">From: {t.pickupAddress || t.location}</span>
                        <span className="block text-slate-500">To: {t.deliveryAddress || 'Sector Distribution Point'}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 min-w-[180px]">
                        <OrderTimeline request={t} />
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button 
                          onClick={() => { setSelectedTask(t); setActionStage('COLLECTED'); }}
                          className="px-3 py-1.5 bg-black text-white font-bold rounded-lg text-[11px] hover:bg-slate-800"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. TAB: COMPLETED TASKS */}
        {activeTab === 'completed' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Completed Deliveries</h2>
              <p className="text-xs text-slate-400">Handovers successfully executed and verified by recipient confirmation</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedTasks.map(c => (
                <div key={c._id} className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{c.itemName}</h4>
                      <p className="text-xs text-slate-500">{c.quantity} units to {c.receiverName || 'Recipient'}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> Verified
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-100 text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800">Review: "{c.reviewComment || 'Provisions reached on time.'}"</p>
                    <p className="text-[11px] text-amber-500 font-bold">Rating: {c.reviewStars || 5} / 5 Stars</p>
                  </div>
                  <OrderTimeline request={c} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: STAGE TRANSITION & PROOF UPLOAD */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-900">Update Task #{selectedTask._id?.slice(-5)}</h3>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-black font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Status:</label>
                <select 
                  value={actionStage} 
                  onChange={(e) => setActionStage(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-semibold"
                >
                  <option value="PICKUP_SCHEDULED">Pickup Scheduled</option>
                  <option value="COLLECTED">Donation Collected from Donor</option>
                  <option value="IN_TRANSIT">Out for Delivery (In Transit)</option>
                  <option value="DELIVERED">Delivered — Awaiting Receiver Confirmation</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status Note / Driver Update:</label>
                <input 
                  value={stageNote} 
                  onChange={(e) => setStageNote(e.target.value)} 
                  placeholder="e.g. Arrived at pickup hub, loaded safely"
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Attach Delivery Proof Photo:</label>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-xs" />
                {proofPhoto && <img src={proofPhoto} alt="Proof" className="w-20 h-20 object-cover rounded-xl mt-2 border" />}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Report Problem / Exception (Optional):</label>
                <input 
                  value={reportedIssue} 
                  onChange={(e) => setReportedIssue(e.target.value)} 
                  placeholder="e.g. Donor unavailable, address mismatch"
                  className="w-full p-2.5 border border-rose-200 text-rose-700 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setSelectedTask(null)} className="flex-1 py-2.5 font-bold border rounded-xl bg-slate-100">Cancel</button>
              <button onClick={handleStageTransition} className="flex-1 py-2.5 bg-black text-white font-bold rounded-xl hover:bg-slate-800">
                Commit Update
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}