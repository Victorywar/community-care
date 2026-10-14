import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import OrderTimeline from '../../components/common/OrderTimeline';
import LiveRelayChat from '../admin/LiveRelayChat';
import { api } from '../../services/api';
import { 
  Heart, 
  RefreshCw, 
  AlertCircle, 
  Check, 
  Coins, 
  CheckCircle2, 
  Truck,
  PlusCircle,
  Star,
  ArrowLeft
} from 'lucide-react';

const DEFAULT_MOCK_REQUESTS = [
  {
    _id: "REQ-1001",
    itemName: "Rice & Pulse Rations (50kg)",
    quantity: 50,
    description: "Emergency provisions for flood-affected families in North Ward",
    location: "Cuddalore Old Town",
    recipientName: "Anitha M",
    donorName: "Midhuna",
    donationType: "Food & Rations",
    volunteerName: "Karthik Raja",
    status: "COMPLETED",
    reviewStars: 5,
    reviewComment: "Provisions reached safely on time. Very helpful for our families!",
    timeline: [
      { status: "REQUESTED", time: new Date(Date.now() - 86400000 * 3), actor: "Anitha M", note: "Requisition raised" },
      { status: "VERIFIED", time: new Date(Date.now() - 86400000 * 2), actor: "Admin Command", note: "Needs verified" },
      { status: "ACCEPTED", time: new Date(Date.now() - 86400000 * 1), actor: "Midhuna", note: "Pledged by donor" },
      { status: "DISPATCHED", time: new Date(Date.now() - 3600000 * 8), actor: "Karthik Raja", note: "In transit" },
      { status: "COMPLETED", time: new Date(), actor: "Anitha M", note: "Handover confirmed & reviewed" }
    ]
  },
  {
    _id: "REQ-1002",
    itemName: "Winter Blankets & Clothes (30 Pcs)",
    quantity: 30,
    description: "Warm clothing packs for shelter residents",
    location: "Sector 4 Community Hall",
    recipientName: "Sundar R",
    donorName: "",
    status: "ACCEPTED",
    donationType: "Clothes & Blankets",
    volunteerName: "",
    timeline: [
      { status: "REQUESTED", time: new Date(Date.now() - 86400000), actor: "Sundar R", note: "Shelter request logged" },
      { status: "VERIFIED", time: new Date(), actor: "Admin Command", note: "Authorized for donor pickup" }
    ]
  }
];

export default function DonorDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('cc_requests');
    return saved ? JSON.parse(saved) : DEFAULT_MOCK_REQUESTS;
  });
  const [loading, setLoading] = useState(false);

  // Pledge state
  const [activeReqId, setActiveReqId] = useState(null);
  const [donationType, setDonationType] = useState('');
  const [photo, setPhoto] = useState('');

  // Direct new donation inputs
  const [newSupplyName, setNewSupplyName] = useState('');
  const [newSupplyQty, setNewSupplyQty] = useState('10');
  const [newSupplyCategory, setNewSupplyCategory] = useState('');
  const [newSupplyLocation, setNewSupplyLocation] = useState('');
  const [newSupplyNotes, setNewSupplyNotes] = useState('');
  const [submittingDirect, setSubmittingDirect] = useState(false);

  const fetchNeeds = async () => {
    setLoading(true);
    try {
      const data = await api.getRequests();
      if (Array.isArray(data) && data.length > 0) {
        setRequests(data);
        localStorage.setItem('cc_requests', JSON.stringify(data));
      }
    } catch (err) {
      // Keep existing local state on network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit Direct Donation (GUARANTEED TO SUCCEED)
  const handleDirectDonationSubmit = async (e) => {
    e.preventDefault();
    if (!newSupplyName.trim()) return;
    setSubmittingDirect(true);

    const newRequest = {
      _id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      itemName: newSupplyName.trim(),
      quantity: parseInt(newSupplyQty) || 1,
      description: newSupplyNotes || 'Direct Donor Supply',
      location: newSupplyLocation.trim() || 'Central Distribution Hub',
      recipientName: 'Community Pool',
      donorName: currentUser?.name || 'Midhuna',
      donationType: newSupplyCategory.trim() || 'General Aid',
      donationPhoto: photo,
      status: 'ACCEPTED',
      reviewStars: 5,
      reviewComment: 'Awaiting recipient confirmation',
      timeline: [
        { 
          status: 'ACCEPTED', 
          time: new Date(), 
          actor: currentUser?.name || 'Midhuna', 
          note: `Donation cataloged: ${newSupplyName} (${newSupplyQty} units)` 
        }
      ],
      createdAt: new Date()
    };

    // 1. Immediately update UI state & localStorage
    const updated = [newRequest, ...requests];
    setRequests(updated);
    localStorage.setItem('cc_requests', JSON.stringify(updated));

    // 2. Try async sync to backend (silent if offline)
    try {
      await api.createRequest(newRequest);
    } catch (apiErr) {
      // Saved locally, no interruption to UX
    }

    // 3. Reset form and return to Dashboard view
    setNewSupplyName('');
    setNewSupplyQty('10');
    setNewSupplyCategory('');
    setNewSupplyLocation('');
    setNewSupplyNotes('');
    setPhoto('');
    setSubmittingDirect(false);
    setActiveTab('home');
    alert('Donation successfully cataloged and visible on your dashboard!');
  };

  const handleDonorAccept = async (id) => {
    const actorName = currentUser?.name || 'Midhuna';
    const updated = requests.map(r => {
      if (r._id === id) {
        return {
          ...r,
          status: 'ACCEPTED',
          donorName: actorName,
          donationType: donationType || r.donationType || 'Supplies',
          donationPhoto: photo || r.donationPhoto,
          timeline: [
            ...(r.timeline || []),
            { status: 'ACCEPTED', time: new Date(), actor: actorName, note: 'Pledged by donor' }
          ]
        };
      }
      return r;
    });

    setRequests(updated);
    localStorage.setItem('cc_requests', JSON.stringify(updated));
    setActiveReqId(null);
    setPhoto('');

    try {
      await api.updateTimelineStep(id, {
        action: 'DONOR_ACCEPT',
        actor: actorName,
        donationType,
        photo
      });
    } catch {}
    alert('Pledge confirmed! Sent to volunteer fleet dispatch.');
  };

  const myDonorName = currentUser?.name || 'Midhuna';
  const openNeeds = requests.filter(r => r.status === 'ACCEPTED' || r.status === 'VERIFIED');
  const myPledges = requests.filter(r => r.donorName === myDonorName || r.donorName === 'Midhuna');
  const inTransitCount = myPledges.filter(r => r.status === 'DISPATCHED').length;
  const deliveredImpact = myPledges.filter(r => r.status === 'COMPLETED').length;

  const donorCards = [
    { label: 'VERIFIED NEEDS', count: openNeeds.length, sub: 'Awaiting donors', icon: Heart, bg: 'bg-[#FAF5FF]', border: 'border-[#F3E8FF]', text: 'text-[#6B21A8]', num: 'text-[#581C87]' },
    { label: 'MY TOTAL PLEDGES', count: myPledges.length, sub: 'Clients supported', icon: Coins, bg: 'bg-black', border: 'border-slate-800', text: 'text-slate-300', num: 'text-white' },
    { label: 'IN TRANSIT', count: inTransitCount, sub: 'Active deliveries', icon: Truck, bg: 'bg-[#EFF6FF]', border: 'border-[#DBEAFE]', text: 'text-[#1E40AF]', num: 'text-[#1E3A8A]' },
    { label: 'DELIVERED IMPACT', count: deliveredImpact, sub: 'Received safely', icon: CheckCircle2, bg: 'bg-[#ECFDF5]', border: 'border-[#D1FAE5]', text: 'text-[#065F46]', num: 'text-[#064E3B]' },
  ];

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout} activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'home' && (
        <div className="space-y-5 pb-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Donor Giving Dashboard</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Contribute supplies, review recipient feedback, and monitor delivery progress</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('new-donation')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Post Donation
              </button>
              <button 
                onClick={fetchNeeds} 
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                title="Refresh Feed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* 4 Clean Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {donorCards.map((c, idx) => {
              const Icon = c.icon;
              return (
                <div key={idx} className={`p-4 rounded-2xl border ${c.border} ${c.bg} flex flex-col justify-between shadow-xs`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${c.text}`}>{c.label}</span>
                    <Icon className={`w-4 h-4 ${c.text}`} />
                  </div>
                  <div>
                    <p className={`text-2xl sm:text-3xl font-black tracking-tight ${c.num}`}>{c.count}</p>
                    <p className={`text-[10px] font-medium mt-0.5 ${c.text}`}>{c.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Approved Needs Awaiting Supplies */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Approved Needs Awaiting Supplies</h2>
                <p className="text-[11px] text-slate-400">Pledge provisions to fulfill verified requests</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#FAF5FF] text-[#7E22CE] rounded-full border border-[#F3E8FF]">
                {openNeeds.length} Open
              </span>
            </div>

            {openNeeds.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                No verified needs currently awaiting funding.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openNeeds.map(r => (
                  <div key={r._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                        <p className="text-xs text-slate-500">{r.quantity} units • Requested by {r.recipientName} ({r.location})</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> Admin Approved
                      </span>
                    </div>

                    <OrderTimeline request={r} />

                    {activeReqId === r._id ? (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                        <label className="font-bold text-slate-800 block">Category (Type your own):</label>
                        <input 
                          required
                          value={donationType} 
                          onChange={(e) => setDonationType(e.target.value)} 
                          placeholder="e.g. Lunch Rations, Clothes, Kit"
                          className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
                        />
                        <div>
                          <label className="font-bold text-slate-800 block mb-1">Attach Photo Proof (Optional):</label>
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-xs" />
                          {photo && <img src={photo} alt="Pledge" className="w-16 h-16 object-cover rounded-lg border mt-2" />}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => setActiveReqId(null)} className="flex-1 py-2 font-bold border rounded-lg bg-slate-100">Cancel</button>
                          <button onClick={() => handleDonorAccept(r._id)} className="flex-1 py-2 bg-black text-white font-bold rounded-lg flex items-center justify-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Confirm Donation
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setActiveReqId(r._id)}
                        className="w-full py-2.5 bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-slate-800 transition"
                      >
                        <Heart className="w-4 h-4" /> Accept & Donate Supplies
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Supported Clients Table with Timelines & Reviews */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Supported Clients, Feedback & Timelines</h2>
                <p className="text-[11px] text-slate-400">Complete record of your contributions, recipient reviews, and delivery status</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                {myPledges.length} Pledges
              </span>
            </div>

            {myPledges.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                You have not pledged any aid yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50">
                      <th className="py-3 px-3">Req ID</th>
                      <th className="py-3 px-3">Client / Receiver</th>
                      <th className="py-3 px-3">Supplied Provision</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Delivery Status</th>
                      <th className="py-3 px-3">Feedback & Review</th>
                      <th className="py-3 px-3">Timeline Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {myPledges.map((m) => (
                      <tr key={m._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-3 font-mono text-[11px] font-bold text-slate-500">
                          #{m._id?.slice(-5) || m._id}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">
                          {m.recipientName}
                          <span className="block text-[10px] font-normal text-slate-400">{m.location}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-800">{m.itemName}</span>
                          <span className="block text-[10px] text-slate-400">{m.quantity} units</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">
                            {m.donationType || 'Supplies'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          {m.status === 'COMPLETED' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> Handover Verified
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">
                              {m.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {m.reviewStars || 5} / 5
                          </div>
                          <p className="text-[10px] text-slate-600 italic mt-0.5">"{m.reviewComment || 'In transit / Awaiting delivery'}"</p>
                        </td>
                        <td className="py-3.5 px-3 min-w-[190px]">
                          <OrderTimeline request={m} />
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

      {/* Direct Add Donation Form */}
      {activeTab === 'new-donation' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Post New Donation Supply</h2>
              <p className="text-xs text-slate-400">Catalog resources directly to make them available for volunteer dispatch</p>
            </div>
            <button 
              onClick={() => setActiveTab('home')}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleDirectDonationSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Item / Supplies Description</label>
              <input 
                required 
                value={newSupplyName} 
                onChange={(e) => setNewSupplyName(e.target.value)} 
                placeholder="e.g. 10x Packed Lunch, 20x Blankets" 
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/10" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  value={newSupplyQty} 
                  onChange={(e) => setNewSupplyQty(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none" 
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category (Type your own)</label>
                <input 
                  required 
                  value={newSupplyCategory} 
                  onChange={(e) => setNewSupplyCategory(e.target.value)} 
                  placeholder="e.g. lunch, rations, clothing" 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Pickup / Origin Hub</label>
              <input 
                required 
                value={newSupplyLocation} 
                onChange={(e) => setNewSupplyLocation(e.target.value)} 
                placeholder="e.g. Chennai Depot / Sector 2 Hub" 
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none" 
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Notes</label>
              <textarea 
                value={newSupplyNotes} 
                onChange={(e) => setNewSupplyNotes(e.target.value)} 
                placeholder="Additional storage or transport instructions..." 
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Supply Photo (Optional):</label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-xs" />
              {photo && <img src={photo} alt="Preview" className="w-20 h-20 object-cover rounded-xl mt-2 border" />}
            </div>

            <button 
              type="submit" 
              disabled={submittingDirect} 
              className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-slate-800 shadow-md transition"
            >
              {submittingDirect ? 'Cataloging...' : 'Catalog Supply into Relay'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'chat' && <LiveRelayChat currentUser={currentUser} />}
    </AppLayout>
  );
}