import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import VolunteerSidebar from '../../components/volunteer/VolunteerSidebar';
import LiveRelayChat from '../admin/LiveRelayChat';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Package, 
  ArrowRight, 
  Phone, 
  Camera, 
  Upload, 
  X, 
  Award, 
  Calendar, 
  Navigation, 
  Inbox,
  AlertCircle
} from 'lucide-react';

export default function VolunteerDashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timelineFilter, setTimelineFilter] = useState('today');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delivery Proof Modal States
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [proofImage, setProofImage] = useState('');
  const [confirmationNotes, setConfirmationNotes] = useState('');
  const [submittingProof, setSubmittingProof] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.getDonations();
      if (Array.isArray(res)) {
        setTasks(res);
      }
    } catch (err) {
      console.error('Failed to load volunteer tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Accept Open Task
  const handleAcceptTask = async (id) => {
    try {
      const token = localStorage.getItem('community_care_token');
      await fetch(`http://localhost:5000/api/donations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'ASSIGNED',
          assignedVolunteer: currentUser?.name || 'Field Volunteer'
        })
      });
      await fetchTasks();
      setActiveTab('assigned');
    } catch (err) {
      console.error('Failed to claim task:', err);
    }
  };

  // Direct status step update
  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      const token = localStorage.getItem('community_care_token');
      await fetch(`http://localhost:5000/api/donations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      await fetchTasks();
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  // Compress & handle proof image
  const handleProofImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setProofImage(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Submit Proof & Complete Task
  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    try {
      setSubmittingProof(true);
      const token = localStorage.getItem('community_care_token');
      await fetch(`http://localhost:5000/api/donations/${selectedTask._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'FULFILLED',
          deliveryProofUrl: proofImage,
          recipientConfirmation: confirmationNotes || 'Recipient confirmed delivery on site.'
        })
      });
      setProofModalOpen(false);
      setSelectedTask(null);
      setProofImage('');
      setConfirmationNotes('');
      await fetchTasks();
      setActiveTab('history');
    } catch (err) {
      console.error('Failed to complete delivery:', err);
    } finally {
      setSubmittingProof(false);
    }
  };

  // Categorize Tasks
  const openTasks = tasks.filter(t => t.status === 'LOGGED');
  const myAssignedTasks = tasks.filter(t => 
    t.status !== 'LOGGED' && 
    t.status !== 'FULFILLED' &&
    (t.assignedVolunteer === currentUser?.name || t.assignedVolunteer === 'Field Volunteer' || !t.assignedVolunteer)
  );
  const completedTasks = tasks.filter(t => 
    t.status === 'FULFILLED' &&
    (t.assignedVolunteer === currentUser?.name || t.assignedVolunteer === 'Field Volunteer' || !t.assignedVolunteer)
  );

  const taskCounts = {
    open: openTasks.length,
    assigned: myAssignedTasks.length,
    completed: completedTasks.length
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <VolunteerSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        taskCounts={taskCounts} 
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-sm font-black text-slate-800 tracking-tight">Volunteer Field Console</h1>
            <p className="text-[10px] text-slate-400">Accept assignments, live transit progress, and verified handovers</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-[#2ecc71] animate-pulse"></span>
            <span className="text-[11px] font-bold text-emerald-800">Field Telemetry Active</span>
          </div>
        </header>

        <div className="p-6 max-w-5xl w-full mx-auto space-y-6">
          {activeTab === 'relay' ? (
            <LiveRelayChat />
          ) : activeTab === 'impact' ? (
            /* My Impact Report */
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                  <Award size={22} />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">Volunteer Impact Metrics</h2>
                  <p className="text-xs text-slate-400">Real verified contributions logged directly into the ledger</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Deliveries Completed</span>
                  <p className="text-3xl font-black text-slate-900 mt-1">{completedTasks.length}</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Units Transported</span>
                  <p className="text-3xl font-black text-amber-600 mt-1">
                    {completedTasks.reduce((acc, curr) => acc + (curr.totalQuantity || 0), 0)}
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Volunteer Honor Score</span>
                  <p className="text-3xl font-black text-[#2ecc71] mt-1">{completedTasks.length * 100} pts</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 1. Overview Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Tasks</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{myAssignedTasks.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Requests</span>
                  <p className="text-2xl font-black text-amber-600 mt-1">{openTasks.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Drops</span>
                  <p className="text-2xl font-black text-[#2ecc71] mt-1">{completedTasks.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Status</span>
                  <p className="text-xs font-bold text-blue-600 mt-3 flex items-center gap-1">
                    <Truck size={14} /> Ready for Dispatch
                  </p>
                </div>
              </div>

              {/* 2. My Timeline View */}
              {(activeTab === 'timeline' || activeTab === 'dashboard') && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-black text-slate-900">My Timeline</h2>
                      <p className="text-xs text-slate-400">Chronological activity pipeline for assigned volunteer duties</p>
                    </div>

                    {/* Timeline Filters */}
                    <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold self-start sm:self-auto">
                      <button
                        onClick={() => setTimelineFilter('today')}
                        className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                          timelineFilter === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Today
                      </button>
                      <button
                        onClick={() => setTimelineFilter('upcoming')}
                        className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                          timelineFilter === 'upcoming' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Upcoming
                      </button>
                      <button
                        onClick={() => setTimelineFilter('completed')}
                        className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                          timelineFilter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Completed
                      </button>
                    </div>
                  </div>

                  {/* Vertical Timeline Activity List */}
                  {myAssignedTasks.length === 0 && timelineFilter !== 'completed' ? (
                    <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl text-center space-y-2">
                      <Calendar size={32} className="mx-auto text-slate-300" />
                      <p className="text-xs font-bold text-slate-500">No scheduled timeline items for this view</p>
                      <p className="text-[11px] text-slate-400">Claim tasks from "Available Requests" to activate your timeline.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      {(timelineFilter === 'completed' ? completedTasks : myAssignedTasks).map((t) => {
                        const isDone = t.status === 'FULFILLED';
                        return (
                          <div key={t._id} className="flex gap-4 items-start p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                            {/* Time */}
                            <div className="w-18 shrink-0 text-right pt-0.5">
                              <span className="text-xs font-black text-slate-900">
                                {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <p className="text-[10px] text-slate-400 font-semibold">{t.status}</p>
                            </div>

                            {/* Node */}
                            <div className="w-3 h-3 rounded-full bg-[#2ecc71] mt-1 shrink-0 ring-4 ring-emerald-100" />

                            {/* Content */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-black text-slate-900">{t.itemName}</h4>
                                <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500">
                                  {t.donationId || t._id.slice(-5)}
                                </span>
                              </div>
                              <div className="text-xs text-slate-600 space-y-1">
                                <p className="flex items-center gap-1.5">
                                  <MapPin size={13} className="text-amber-500 shrink-0" />
                                  <span>Pickup: <strong>{t.pickupAddress || 'Donor Address'}</strong></span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <Navigation size={13} className="text-blue-500 shrink-0" />
                                  <span>Drop: <strong>{t.deliveryAddress || 'NGO Relief Centre'}</strong></span>
                                </p>
                              </div>

                              {/* Progression Action */}
                              {!isDone && (
                                <div className="pt-2 flex flex-wrap gap-2">
                                  {t.status === 'ASSIGNED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(t._id, 'COLLECTED')}
                                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                                    >
                                      Donation Collected
                                    </button>
                                  )}
                                  {t.status === 'COLLECTED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(t._id, 'OUT_FOR_DELIVERY')}
                                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                                    >
                                      Out for Delivery
                                    </button>
                                  )}
                                  {t.status === 'OUT_FOR_DELIVERY' && (
                                    <button
                                      onClick={() => { setSelectedTask(t); setProofModalOpen(true); }}
                                      className="px-3 py-1.5 bg-[#2ecc71] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1"
                                    >
                                      <Camera size={13} />
                                      <span>Upload Proof & Deliver</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Available Opportunities Section */}
              {(activeTab === 'available' || activeTab === 'dashboard') && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-black text-slate-900">Available Opportunities</h2>
                      <p className="text-xs text-slate-400">Nearby donation packages awaiting volunteer pickup</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {openTasks.length} Available
                    </span>
                  </div>

                  {openTasks.length === 0 ? (
                    <div className="py-10 border-2 border-dashed border-slate-100 rounded-2xl text-center space-y-1">
                      <Inbox size={28} className="mx-auto text-slate-300" />
                      <p className="text-xs font-bold text-slate-500">No open tasks currently</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {openTasks.map(item => (
                        <div key={item._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {item.photoUrl ? (
                              <img src={item.photoUrl} alt={item.itemName} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                                <Package size={20} />
                              </div>
                            )}
                            <div>
                              <h4 className="text-xs font-black text-slate-900">{item.itemName}</h4>
                              <p className="text-[11px] text-slate-500">
                                {item.totalQuantity} {item.unit} • Quality: {item.qualityGrade}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Donor: {item.donorName}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAcceptTask(item._id)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <span>Accept Task</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Assigned Tasks Detailed */}
              {activeTab === 'assigned' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h2 className="text-base font-black text-slate-900">My Assigned Tasks</h2>
                  {myAssignedTasks.length === 0 ? (
                    <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl text-center text-xs text-slate-400">
                      No active assignments. Accept tasks from Available Requests.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myAssignedTasks.map(t => (
                        <div key={t._id} className="p-5 rounded-2xl border border-amber-200 bg-amber-50/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-900">{t.itemName}</h3>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                              {t.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-100">
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">Donor Information</p>
                              <p className="font-bold text-slate-800 mt-0.5">{t.donorName}</p>
                              <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                                <Phone size={11} /> {t.donorPhone || '+91 98765 43210'}
                              </p>
                              <p className="text-slate-500 mt-0.5">Pickup: {t.pickupAddress || 'City Depot'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">Recipient / NGO</p>
                              <p className="font-bold text-slate-800 mt-0.5">{t.recipientName || 'Relief Camp #4'}</p>
                              <p className="text-slate-500 mt-0.5">Destination: {t.deliveryAddress || 'Shelter Ward'}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            {t.status === 'ASSIGNED' && (
                              <button
                                onClick={() => handleUpdateStatus(t._id, 'COLLECTED')}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                              >
                                Collect Donation
                              </button>
                            )}
                            {t.status === 'COLLECTED' && (
                              <button
                                onClick={() => handleUpdateStatus(t._id, 'OUT_FOR_DELIVERY')}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                              >
                                Out for Delivery
                              </button>
                            )}
                            {t.status === 'OUT_FOR_DELIVERY' && (
                              <button
                                onClick={() => { setSelectedTask(t); setProofModalOpen(true); }}
                                className="px-4 py-2 bg-[#2ecc71] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                              >
                                <Camera size={14} />
                                <span>Upload Proof & Complete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. Completed History */}
              {activeTab === 'history' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h2 className="text-base font-black text-slate-900">Delivery Proof & History</h2>
                  {completedTasks.length === 0 ? (
                    <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl text-center text-xs text-slate-400">
                      No completed deliveries logged yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {completedTasks.map(t => (
                        <div key={t._id} className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              {t.donationId || t._id.slice(-5)}
                            </span>
                            <span className="text-[10px] font-black text-[#2ecc71] flex items-center gap-1">
                              <CheckCircle2 size={12} /> DELIVERED
                            </span>
                          </div>

                          <div>
                            <h4 className="text-xs font-black text-slate-900">{t.itemName}</h4>
                            <p className="text-[11px] text-slate-500">{t.totalQuantity} {t.unit} • Verified Drop</p>
                          </div>

                          {t.deliveryProofUrl && (
                            <img src={t.deliveryProofUrl} alt="Delivery proof" className="w-full h-32 object-cover rounded-xl border border-emerald-200" />
                          )}

                          {t.recipientConfirmation && (
                            <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                              "{t.recipientConfirmation}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Delivery Proof Upload Modal */}
      {proofModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Upload Delivery Proof</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedTask?.itemName}</p>
              </div>
              <button onClick={() => setProofModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitProof} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Handover Photo Proof</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-600 font-semibold">
                    <Camera size={15} />
                    <span>Take / Choose Photo</span>
                    <input type="file" accept="image/*" onChange={handleProofImage} className="hidden" />
                  </label>
                  {proofImage && (
                    <img src={proofImage} alt="Proof preview" className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Recipient Confirmation / Signature Note</label>
                <textarea
                  rows="2"
                  required
                  placeholder="e.g. Received by Camp Incharge Sundar, verified 20 kits."
                  value={confirmationNotes}
                  onChange={(e) => setConfirmationNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProofModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProof || !proofImage}
                  className="flex-1 py-2.5 bg-[#2ecc71] hover:bg-emerald-600 text-white rounded-xl font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {submittingProof ? 'Completing...' : 'Confirm Delivery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
