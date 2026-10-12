import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import RecipientSidebar from '../../components/recipient/RecipientSidebar';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Plus, 
  X, 
  Check, 
  ChevronRight,
  GitCommit,
  Bell,
  User,
  HelpCircle,
  Phone,
  MapPin,
  AlertTriangle,
  FileText,
  Calendar,
  ShieldCheck,
  Send,
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';

export default function RecipientDashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState(null);
  const [filterUrgency, setFilterUrgency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    orgName: '',
    category: 'Food',
    itemName: '',
    quantityNeeded: '',
    unit: 'Packs',
    urgency: 'Normal',
    description: '',
    deliveryAddress: '',
    contactNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.getRequests();
      if (Array.isArray(res)) {
        setRequests(res);
        if (res.length > 0 && !selectedReqId) {
          setSelectedReqId(res[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load recipient requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemName || !formData.quantityNeeded) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('community_care_token');
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({
          orgName: '',
          category: 'Food',
          itemName: '',
          quantityNeeded: '',
          unit: 'Packs',
          urgency: 'Normal',
          description: '',
          deliveryAddress: '',
          contactNumber: ''
        });
        await fetchRequests();
      }
    } catch (err) {
      console.error('Error submitting request:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmReceived = async (id) => {
    try {
      const token = localStorage.getItem('community_care_token');
      await fetch('http://localhost:5000/api/requests/' + id + '/confirm', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ remarks: 'Confirmed received by recipient' })
      });
      await fetchRequests();
    } catch (err) {
      console.error('Error confirming delivery:', err);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const activeCount = requests.filter(r => r.status === 'APPROVED' || r.status === 'IN_TRANSIT').length;
  const receivedCount = requests.filter(r => r.status === 'DELIVERED').length;

  const counts = {
    total: requests.length,
    pending: pendingCount,
    active: activeCount,
    received: receivedCount
  };

  const currentTrackItem = requests.find(r => r._id === selectedReqId) || requests[0];

  const getTimelineSteps = (req) => {
    if (!req) return [];
    let currentIdx = 0;
    if (req.status === 'PENDING') currentIdx = 0;
    if (req.status === 'APPROVED') currentIdx = 2;
    if (req.status === 'IN_TRANSIT') currentIdx = 4;
    if (req.status === 'DELIVERED') currentIdx = 5;

    return [
      {
        title: 'Request Submitted',
        desc: 'Aid ticket generated and registered in the dispatch ledger.',
        time: 'Logged',
        status: currentIdx >= 0 ? 'Completed' : 'Upcoming'
      },
      {
        title: 'Under Regional Review',
        desc: 'Reviewing relief package allocation and supply priority.',
        time: 'Verification',
        status: currentIdx >= 1 ? 'Completed' : currentIdx === 0 ? 'In Progress' : 'Upcoming'
      },
      {
        title: 'Request Approved & Assigned',
        desc: req.assignedVolunteer && req.assignedVolunteer !== 'Under Review'
          ? ('Assigned to field unit ' + req.assignedVolunteer + '.')
          : 'Approved. Designating available field volunteer unit.',
        time: 'Assigned',
        status: currentIdx >= 2 ? 'Completed' : 'Upcoming'
      },
      {
        title: 'Out for Delivery (In Transit)',
        desc: 'Supplies picked up and currently in transit to your drop address.',
        time: 'Transit',
        status: currentIdx >= 4 ? 'Completed' : currentIdx === 3 ? 'In Progress' : 'Upcoming'
      },
      {
        title: 'Delivered & Handover Confirmed',
        desc: 'Relief goods handed over and reception confirmed.',
        time: 'Fulfilled',
        status: currentIdx >= 5 ? 'Completed' : 'Upcoming'
      }
    ];
  };

  // Filtered requests for "All Requests" tab
  const filteredRequests = requests.filter(r => {
    const matchesUrgency = filterUrgency === 'ALL' || r.urgency?.toUpperCase() === filterUrgency;
    const matchesSearch = !searchQuery || 
      r.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUrgency && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* 1. Permanent Recipient Sidebar */}
      <RecipientSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        counts={counts}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-sm font-black text-slate-800 tracking-tight capitalize">
              {activeTab === 'dashboard' && 'Recipient Portal Overview'}
              {activeTab === 'timeline' && 'Track My Requests (Live Telemetry)'}
              {activeTab === 'requests' && 'All Community Aid Requests'}
              {activeTab === 'received' && 'Verified Received Donations'}
              {activeTab === 'notifications' && 'System Notifications & Broadcasts'}
              {activeTab === 'profile' && 'Recipient Desk Profile'}
              {activeTab === 'help' && 'Emergency Relief Help & Support'}
            </h1>
            <p className="text-[10px] text-slate-400">
              Autonomous aid distribution and live delivery tracking
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Request Donation</span>
          </button>
        </header>

        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">

          {/* ==============================================================
              TAB 1: DASHBOARD (Overview Cards + Table + Side Timeline)
              ============================================================== */}
          {activeTab === 'dashboard' && (
            <>
              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Requests</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">{requests.length}</p>
                    <span className="text-[10px] text-slate-400 font-medium">Logged in portal</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Package size={20} />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Review</span>
                    <p className="text-2xl font-black text-amber-500 mt-1">{pendingCount}</p>
                    <span className="text-[10px] text-amber-600 font-medium">Awaiting verification</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                    <Clock size={20} />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active & Transit</span>
                    <p className="text-2xl font-black text-blue-600 mt-1">{activeCount}</p>
                    <span className="text-[10px] text-blue-500 font-medium">Being delivered</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Truck size={20} />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Received Aid</span>
                    <p className="text-2xl font-black text-[#2ecc71] mt-1">{receivedCount}</p>
                    <span className="text-[10px] text-emerald-600 font-medium">Fulfilled & Verified</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2ecc71] flex items-center justify-center font-bold">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
              </div>

              {/* Side-by-side Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Your Aid Requests</h2>
                    <p className="text-xs text-slate-400">Track real-time status of your food, medicine, and support deliveries</p>
                  </div>

                  {loading ? (
                    <p className="text-center py-12 text-xs text-slate-400">Loading aid requests...</p>
                  ) : requests.length === 0 ? (
                    <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl text-center space-y-2">
                      <Package size={32} className="mx-auto text-slate-300" />
                      <p className="text-xs font-bold text-slate-500">No aid requests logged yet</p>
                      <p className="text-[11px] text-slate-400">Tap "+ Request Donation" above to submit requirements.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                            <th className="pb-3 px-3">Req ID</th>
                            <th className="pb-3 px-3">Item Description</th>
                            <th className="pb-3 px-3">Urgency</th>
                            <th className="pb-3 px-3">Live Status</th>
                            <th className="pb-3 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {requests.slice(0, 5).map((req) => {
                            const isSelected = (selectedReqId === req._id) || (!selectedReqId && req._id === requests[0]._id);
                            return (
                              <tr 
                                key={req._id} 
                                onClick={() => setSelectedReqId(req._id)}
                                className={
                                  "cursor-pointer transition-colors " +
                                  (isSelected ? "bg-blue-50/60" : "hover:bg-slate-50/60")
                                }
                              >
                                <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                                  {req.requestId || req._id.slice(-6)}
                                </td>
                                <td className="py-3.5 px-3">
                                  <p className="font-black text-slate-900">{req.itemName}</p>
                                  <span className="text-[11px] text-slate-400 font-normal">
                                    Quantity: {req.quantityNeeded} {req.unit} • {req.category}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3">
                                  <span className={
                                    "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase " +
                                    (req.urgency === 'Critical' || req.urgency === 'Emergency'
                                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                                      : req.urgency === 'High' || req.urgency === 'Urgent'
                                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                                      : "bg-slate-100 text-slate-500 border border-slate-200")
                                  }>
                                    {req.urgency}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3">
                                  <span className={
                                    "px-2 py-0.5 rounded-full text-[10px] font-black uppercase border " +
                                    (req.status === 'DELIVERED'
                                      ? "bg-emerald-50 text-[#2ecc71] border-emerald-200"
                                      : req.status === 'IN_TRANSIT'
                                      ? "bg-blue-50 text-blue-600 border-blue-200"
                                      : req.status === 'APPROVED'
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-amber-50 text-amber-600 border-amber-200")
                                  }>
                                    {req.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 text-right">
                                  {req.status === 'IN_TRANSIT' ? (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleConfirmReceived(req._id); }}
                                      className="px-3 py-1 bg-[#2ecc71] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 ml-auto"
                                    >
                                      <CheckCircle2 size={12} />
                                      <span>Confirm</span>
                                    </button>
                                  ) : (
                                    <span className="text-[11px] font-bold text-blue-600 flex items-center justify-end gap-1">
                                      <span>Track</span>
                                      <ChevronRight size={13} />
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Right Side Heading Timeline */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <GitCommit size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">My Request Timeline</h3>
                        <p className="text-[10px] text-slate-400">
                          Request ID: <strong className="text-slate-700">{currentTrackItem?.requestId || 'CC-1024'}</strong>
                        </p>
                      </div>
                    </div>

                    {currentTrackItem ? (
                      <div className="pt-4 space-y-4">
                        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-slate-900">{currentTrackItem.itemName}</h4>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                              {currentTrackItem.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Quantity: <strong>{currentTrackItem.quantityNeeded} {currentTrackItem.unit}</strong>
                          </p>
                        </div>

                        <div className="space-y-4 pt-1">
                          {getTimelineSteps(currentTrackItem).map((step, idx) => {
                            const isDone = step.status === 'Completed';
                            const inProg = step.status === 'In Progress';

                            return (
                              <div key={idx} className="flex gap-3 relative">
                                <div className="flex flex-col items-center">
                                  <div className={
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all " +
                                    (isDone
                                      ? "bg-[#2ecc71] text-white shadow-xs"
                                      : inProg
                                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                      : "bg-slate-200 text-slate-400")
                                  }>
                                    {isDone ? <Check size={13} strokeWidth={3} /> : idx + 1}
                                  </div>
                                  {idx < 4 && (
                                    <div className={
                                      "w-0.5 h-10 my-1 " +
                                      (isDone ? "bg-[#2ecc71]" : "bg-slate-200")
                                    } />
                                  )}
                                </div>
                                <div className="pt-0.5 flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className={
                                      "text-xs font-black " +
                                      (isDone ? "text-slate-900" : inProg ? "text-blue-700" : "text-slate-400")
                                    }>
                                      {step.title}
                                    </h4>
                                    <span className={
                                      "text-[9px] font-bold px-1.5 py-0.5 rounded " +
                                      (isDone ? "bg-emerald-50 text-[#2ecc71]" : inProg ? "bg-blue-50 text-blue-600" : "text-slate-300")
                                    }>
                                      {step.status}
                                    </span>
                                  </div>
                                  <p className={
                                    "text-[11px] mt-0.5 " +
                                    (isDone || inProg ? "text-slate-500" : "text-slate-300")
                                  }>
                                    {step.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-xs text-slate-400">
                        Select a request to view its timeline.
                      </div>
                    )}
                  </div>

                  {currentTrackItem && currentTrackItem.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => handleConfirmReceived(currentTrackItem._id)}
                      className="w-full mt-4 py-2.5 bg-[#2ecc71] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      <span>Confirm Donation Received</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ==============================================================
              TAB 2: TRACK MY REQUESTS (Dedicated Full Timeline View)
              ============================================================== */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-black text-slate-900">Active Request Progress Tracker</h2>
                  <p className="text-xs text-slate-400">Step-by-step verified telemetry for your ongoing relief needs</p>
                </div>
                {requests.length > 0 && (
                  <select 
                    value={selectedReqId || ''} 
                    onChange={(e) => setSelectedReqId(e.target.value)}
                    className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    {requests.map(r => (
                      <option key={r._id} value={r._id}>
                        {r.requestId || 'REQ'} - {r.itemName} ({r.status})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {currentTrackItem ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Summary Info */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {currentTrackItem.requestId || 'CC-1024'}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-[#2ecc71] border border-emerald-200">
                          {currentTrackItem.status}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">{currentTrackItem.itemName}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Category: <strong>{currentTrackItem.category}</strong>
                        </p>
                        <p className="text-xs text-slate-500">
                          Required Count: <strong>{currentTrackItem.quantityNeeded} {currentTrackItem.unit}</strong>
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                        <p className="flex items-start gap-2">
                          <MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />
                          <span>Destination: <strong>{currentTrackItem.deliveryAddress || 'Primary Shelter'}</strong></span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Truck size={14} className="text-amber-500 shrink-0" />
                          <span>Assigned Squad: <strong>{currentTrackItem.assignedVolunteer || 'Volunteer Dispatch'}</strong></span>
                        </p>
                      </div>

                      {currentTrackItem.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => handleConfirmReceived(currentTrackItem._id)}
                          className="w-full py-2.5 bg-[#2ecc71] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={14} />
                          <span>Confirm Received Goods</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right 2 Cols: Expanded Timeline Stages */}
                  <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
                    <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
                      <GitCommit size={18} className="text-blue-600" />
                      <span>Live Progress Timeline Stages</span>
                    </h3>

                    <div className="space-y-6">
                      {getTimelineSteps(currentTrackItem).map((step, idx) => {
                        const isDone = step.status === 'Completed';
                        const inProg = step.status === 'In Progress';

                        return (
                          <div key={idx} className="flex gap-4 relative">
                            <div className="flex flex-col items-center">
                              <div className={
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all " +
                                (isDone
                                  ? "bg-[#2ecc71] text-white shadow-sm"
                                  : inProg
                                  ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse"
                                  : "bg-slate-100 text-slate-400 border border-slate-200")
                              }>
                                {isDone ? <Check size={16} strokeWidth={3} /> : idx + 1}
                              </div>
                              {idx < 4 && (
                                <div className={
                                  "w-0.5 h-14 my-1.5 transition-all " +
                                  (isDone ? "bg-[#2ecc71]" : "bg-slate-200")
                                } />
                              )}
                            </div>

                            <div className="flex-1 pb-4">
                              <div className="flex items-center justify-between">
                                <h4 className={
                                  "text-sm font-black " +
                                  (isDone ? "text-slate-900" : inProg ? "text-blue-700" : "text-slate-400")
                                }>
                                  {step.title}
                                </h4>
                                <span className={
                                  "text-[10px] font-black px-2 py-0.5 rounded-full uppercase " +
                                  (isDone ? "bg-emerald-50 text-[#2ecc71]" : inProg ? "bg-blue-50 text-blue-600" : "text-slate-400 bg-slate-100")
                                }>
                                  {step.status}
                                </span>
                              </div>
                              <p className={
                                "text-xs mt-1 leading-relaxed " +
                                (isDone || inProg ? "text-slate-600" : "text-slate-400")
                              }>
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-xs text-slate-400">
                  No active requests to track right now. Click "+ Request Donation" to start.
                </div>
              )}
            </div>
          )}

          {/* ==============================================================
              TAB 3: ALL REQUESTS (Comprehensive Filterable Table)
              ============================================================== */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-slate-900">All Submitted Aid Requests</h2>
                  <p className="text-xs text-slate-400">Complete catalog of submitted assistance tickets</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterUrgency}
                    onChange={(e) => setFilterUrgency(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="ALL">All Urgencies</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="URGENT">Urgent</option>
                    <option value="NORMAL">Normal</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="pb-3 px-3">Req ID</th>
                      <th className="pb-3 px-3">Item Details</th>
                      <th className="pb-3 px-3">Category</th>
                      <th className="pb-3 px-3">Urgency</th>
                      <th className="pb-3 px-3">Address</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-3 font-mono font-bold text-slate-900">
                          {req.requestId || req._id.slice(-6)}
                        </td>
                        <td className="py-4 px-3">
                          <p className="font-black text-slate-900">{req.itemName}</p>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {req.quantityNeeded} {req.unit}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {req.category}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <span className={
                            "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase " +
                            (req.urgency === 'Critical' || req.urgency === 'Emergency'
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : req.urgency === 'High' || req.urgency === 'Urgent'
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200")
                          }>
                            {req.urgency}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-slate-500 text-[11px] max-w-xs truncate">
                          {req.deliveryAddress || 'Primary Location'}
                        </td>
                        <td className="py-4 px-3">
                          <span className={
                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase border " +
                            (req.status === 'DELIVERED'
                              ? "bg-emerald-50 text-[#2ecc71] border-emerald-200"
                              : req.status === 'IN_TRANSIT'
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : req.status === 'APPROVED'
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-600 border-amber-200")
                          }>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button
                            onClick={() => { setSelectedReqId(req._id); setActiveTab('timeline'); }}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                          >
                            Track Live
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 4: RECEIVED DONATIONS (Proof & Handover Archive)
              ============================================================== */}
          {activeTab === 'received' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-base font-black text-slate-900">Received Donations & Verified Handover Archive</h2>
                <p className="text-xs text-slate-400">All relief items successfully delivered and verified at your point</p>
              </div>

              {receivedCount === 0 ? (
                <div className="py-16 border-2 border-dashed border-slate-100 rounded-2xl text-center space-y-2">
                  <CheckCircle2 size={36} className="mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-500">No received packages recorded yet</p>
                  <p className="text-[11px] text-slate-400">Items will archive here once volunteer drop-off is verified.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {requests.filter(r => r.status === 'DELIVERED').map(item => (
                    <div key={item._id} className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {item.requestId || item._id.slice(-5)}
                        </span>
                        <span className="text-[10px] font-black uppercase text-[#2ecc71] flex items-center gap-1">
                          <CheckCircle2 size={12} /> VERIFIED RECEIPT
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{item.itemName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Received: {item.quantityNeeded} {item.unit} • {item.category}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-emerald-100/80 text-[11px] text-slate-600">
                        <p><strong>Volunteer Handler:</strong> {item.assignedVolunteer || 'Field Unit'}</p>
                        <p className="mt-1 text-slate-400 italic">"Delivered safely to community shelter."</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==============================================================
              TAB 5: NOTIFICATIONS (Full Alerts & Dispatch Feed)
              ============================================================== */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-black text-slate-900">Notifications & Dispatch Feed</h2>
                  <p className="text-xs text-slate-400">Real-time alerts, volunteer updates, and regional broadcasts</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  {activeCount + pendingCount} Active Alerts
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {requests.filter(r => r.status === 'IN_TRANSIT').map(r => (
                  <div key={r._id} className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Truck size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-blue-900">Package In Transit to Your Location</h4>
                        <span className="text-[10px] text-blue-500 font-bold">Active Now</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Your request for <strong>{r.itemName}</strong> ({r.quantityNeeded} {r.unit}) is on the road. Volunteer {r.assignedVolunteer || 'Squad'} is en route.
                      </p>
                    </div>
                  </div>
                ))}

                {requests.filter(r => r.status === 'APPROVED').map(r => (
                  <div key={r._id} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#2ecc71] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-emerald-950">Aid Request Approved</h4>
                        <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Request #{r.requestId || 'REQ'} for <strong>{r.itemName}</strong> has passed admin review and is queued for volunteer collection.
                      </p>
                    </div>
                  </div>
                ))}

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900">Regional Weather & Relief Advisory</h4>
                      <span className="text-[10px] text-slate-400 font-bold">Today</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Emergency food grain & dry ration distribution routes are prioritized across flood-affected zones in Sector 4.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 6: MY PROFILE
              ============================================================== */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-900">Recipient Desk Profile</h2>
                <p className="text-xs text-slate-400">Manage registered shelter details and contact credentials</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{currentUser?.name || 'Verified Recipient'}</h3>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ● Active Verified Recipient Desk
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Email</span>
                  <p className="font-bold text-slate-800 mt-1">{currentUser?.email || 'recipient@communitycare.org'}</p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone</span>
                  <p className="font-bold text-slate-800 mt-1">+91 98765 43210</p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-100 sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Designated Delivery Drop Address</span>
                  <p className="font-bold text-slate-800 mt-1">Shelter Point 4, Sector 9, Community Rehabilitation Center</p>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 7: HELP & SUPPORT
              ============================================================== */}
          {activeTab === 'help' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-900">Help & Emergency Relief Support</h2>
                <p className="text-xs text-slate-400">Direct contact channels with community coordinators</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/40 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Phone size={18} />
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Emergency Dispatch Hotline</h4>
                  <p className="text-xs font-bold text-blue-700">+91 1800-425-CARE</p>
                  <p className="text-[11px] text-slate-500">24/7 Regional Emergency Desk</p>
                </div>

                <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#2ecc71] text-white flex items-center justify-center">
                    <MessageSquare size={18} />
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Field Volunteer WhatsApp</h4>
                  <p className="text-xs font-bold text-emerald-700">+91 98400 11223</p>
                  <p className="text-[11px] text-slate-500">Direct squad coordination</p>
                </div>

                <div className="p-5 rounded-2xl border border-amber-100 bg-amber-50/40 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Regional Admin Desk</h4>
                  <p className="text-xs font-bold text-amber-800">Cuddalore Hub #1</p>
                  <p className="text-[11px] text-slate-500">Disaster Management Wing</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
                <h4 className="text-xs font-black text-slate-900">Frequently Asked Questions</h4>
                <div className="text-xs text-slate-600 space-y-2">
                  <p><strong>Q: How long does approval take?</strong> Normal requests are processed within 2-4 hours, while Emergency tickets are dispatched immediately.</p>
                  <p><strong>Q: Can I update my delivery address?</strong> Yes, call the dispatch hotline or notify your assigned volunteer when status moves to "In Transit".</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Request Donation Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Request Donation</h3>
                <p className="text-xs text-slate-400 mt-0.5">Submit immediate requirements for community assistance</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name / Organization Name</label>
                <input
                  type="text"
                  placeholder="e.g. Hope Orphanage / Sundar Family"
                  value={formData.orgName}
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Donation Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Food">Food & Groceries</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Medicine">Medicines</option>
                    <option value="Education">Educational Materials</option>
                    <option value="Essential">Essential Items</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Clothing items, Infant Milk Powder"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Required Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 5"
                    value={formData.quantityNeeded}
                    onChange={(e) => setFormData({ ...formData, quantityNeeded: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="Items / Packs / Sets"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  placeholder="Drop-off address or shelter location"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Request</label>
                <textarea
                  rows="2"
                  placeholder="Describe your situation and requirement..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}