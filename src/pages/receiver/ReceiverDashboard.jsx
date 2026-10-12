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
  FileCheck2,
  Search,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export default function ReceiverDashboard() {
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
      console.error('Failed to load requests:', err);
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
  const receivedCount = requests.filter(r => r.status === 'DELIVERED' || r.status === 'COMPLETED').length;

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
    if (req.status === 'DELIVERED' || req.status === 'COMPLETED') currentIdx = 5;

    return [
      {
        title: 'Request Submitted',
        desc: 'Aid ticket logged in dispatch pipeline.',
        status: currentIdx >= 0 ? 'Completed' : 'Upcoming'
      },
      {
        title: 'Under Review',
        desc: 'Reviewing allocation and verification priority.',
        status: currentIdx >= 1 ? 'Completed' : currentIdx === 0 ? 'In Progress' : 'Upcoming'
      },
      {
        title: 'Approved & Volunteer Assigned',
        desc: req.assignedVolunteer && req.assignedVolunteer !== 'Under Admin Review'
          ? ('Assigned to ' + req.assignedVolunteer)
          : 'Assigned to regional aid squad.',
        status: currentIdx >= 2 ? 'Completed' : 'Upcoming'
      },
      {
        title: 'Out for Delivery',
        desc: 'Items in transit to delivery address.',
        status: currentIdx >= 4 ? 'Completed' : currentIdx === 3 ? 'In Progress' : 'Upcoming'
      },
      {
        title: 'Delivered & Confirmed',
        desc: 'Handover complete and verified.',
        status: currentIdx >= 5 ? 'Completed' : 'Upcoming'
      }
    ];
  };

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
      <RecipientSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        counts={counts}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
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
            <p className="text-[10px] text-slate-400">Autonomous aid distribution and live delivery tracking</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Request Support</span>
          </button>
        </header>

        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Your Aid Requests</h2>
                    <p className="text-xs text-slate-400">Track real-time status of your food, medicine, and support deliveries</p>
                  </div>

                  {loading ? (
                    <p className="text-center py-12 text-xs text-slate-400">Loading requests...</p>
                  ) : requests.length === 0 ? (
                    <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl text-center space-y-2">
                      <Package size={32} className="mx-auto text-slate-300" />
                      <p className="text-xs font-bold text-slate-500">No aid requests logged yet</p>
                      <p className="text-[11px] text-slate-400">Tap "+ Request Support" above to submit requirements.</p>
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
                          {requests.map((req) => {
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
                                    (req.status === 'DELIVERED' || req.status === 'COMPLETED'
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
                                      <FileCheck2 size={13} />
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
                </div>
              </div>
            </>
          )}

          {/* TAB 2: TRACK MY REQUESTS */}
          {activeTab === 'timeline' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900">Live Telemetry Pipeline</h2>
                  <p className="text-xs text-slate-400">Track delivery coordinates and volunteer milestones</p>
                </div>
                {requests.length > 0 && (
                  <select 
                    value={selectedReqId || ''} 
                    onChange={(e) => setSelectedReqId(e.target.value)}
                    className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    {requests.map(r => (
                      <option key={r._id} value={r._id}>
                        {r.requestId || 'REQ'} - {r.itemName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {currentTrackItem && (
                <div className="space-y-6 pt-4">
                  {getTimelineSteps(currentTrackItem).map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs " +
                          (step.status === 'Completed' ? "bg-[#2ecc71] text-white shadow-xs" : "bg-slate-100 text-slate-400")
                        }>
                          {step.status === 'Completed' ? <Check size={16} /> : idx + 1}
                        </div>
                        {idx < 4 && <div className={"w-0.5 h-12 my-1 " + (step.status === 'Completed' ? "bg-[#2ecc71]" : "bg-slate-200")} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{step.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ALL REQUESTS */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">All Submitted Requests</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3 px-3">Req ID</th>
                      <th className="pb-3 px-3">Item Details</th>
                      <th className="pb-3 px-3">Category</th>
                      <th className="pb-3 px-3">Urgency</th>
                      <th className="pb-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map(r => (
                      <tr key={r._id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-bold">{r.requestId || r._id.slice(-6)}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{r.itemName}</td>
                        <td className="py-3 px-3">{r.category}</td>
                        <td className="py-3 px-3 font-bold">{r.urgency}</td>
                        <td className="py-3 px-3">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: RECEIVED DONATIONS */}
          {activeTab === 'received' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-slate-900">Received & Fulfilled Aid</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {requests.filter(r => r.status === 'DELIVERED' || r.status === 'COMPLETED').map(r => (
                  <div key={r._id} className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                    <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {r.requestId || r._id.slice(-5)}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 mt-2">{r.itemName}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">{r.quantityNeeded} {r.unit} • Verified Drop</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h2 className="text-base font-black text-slate-900">Notification Feed</h2>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-900 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-600" />
                <span>Field units are active in your sector. Dispatches are tracked in real-time.</span>
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-md bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h2 className="text-base font-black text-slate-900">Recipient Profile</h2>
              <p className="text-xs text-slate-600"><strong>Name:</strong> {currentUser?.name || 'Reception Desk'}</p>
              <p className="text-xs text-slate-600"><strong>Email:</strong> {currentUser?.email}</p>
              <p className="text-xs text-slate-600"><strong>Role:</strong> RECIPIENT</p>
            </div>
          )}

          {/* TAB 7: HELP */}
          {activeTab === 'help' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-slate-900">Emergency Support Hotline</h2>
              <p className="text-xs text-slate-600">Call <strong>+91 1800-425-CARE</strong> for immediate emergency aid distribution.</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Request Relief Support</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Organization / Family Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ward 4 Community"
                  value={formData.orgName}
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Food">Food</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Education">Education</option>
                    <option value="Essential">Essential</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Grocery Packs, Insulin"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantityNeeded}
                    onChange={(e) => setFormData({ ...formData, quantityNeeded: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50"
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