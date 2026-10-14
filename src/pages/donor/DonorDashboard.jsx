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
  Star
} from 'lucide-react';

export default function DonorDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeReqId, setActiveReqId] = useState(null);
  const [donationType, setDonationType] = useState('Food & Rations');
  const [photo, setPhoto] = useState('');

  // Direct new donation states (custom free text for Category)
  const [newSupplyName, setNewSupplyName] = useState('');
  const [newSupplyQty, setNewSupplyQty] = useState('10');
  const [newSupplyCategory, setNewSupplyCategory] = useState('');
  const [newSupplyLocation, setNewSupplyLocation] = useState('');
  const [newSupplyNotes, setNewSupplyNotes] = useState('');
  const [submittingDirect, setSubmittingDirect] = useState(false);

  const fetchNeeds = async () => {
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

  useEffect(() => { fetchNeeds(); }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDonorAccept = async (id) => {
    try {
      await api.updateTimelineStep(id, {
        action: 'DONOR_ACCEPT',
        actor: currentUser?.name || 'Community Donor',
        donationType: donationType || 'Essentials',
        photo
      });
      setActiveReqId(null);
      setPhoto('');
      fetchNeeds();
      alert("Pledge submitted! Requisition forwarded to volunteer transit.");
    } catch {
      alert("Error processing donation pledge");
    }
  };

  const handleDirectDonationSubmit = async (e) => {
    e.preventDefault();
    if (!newSupplyName.trim()) return;
    setSubmittingDirect(true);
    try {
      await api.createRequest({
        itemName: newSupplyName,
        quantity: parseInt(newSupplyQty) || 1,
        description: `Direct Donor Supply: ${newSupplyNotes}`,
        location: newSupplyLocation || 'Central Distribution Hub',
        recipientName: 'Community Pool',
        donorName: currentUser?.name || 'Community Donor',
        donationType: newSupplyCategory || 'General Aid',
        donationPhoto: photo,
        status: 'ACCEPTED'
      });
      setNewSupplyName('');
      setNewSupplyCategory('');
      setNewSupplyNotes('');
      setNewSupplyLocation('');
      setPhoto('');
      setActiveTab('home');
      fetchNeeds();
      alert("Donation cataloged and made available to field dispatch!");
    } catch {
      alert("Error posting direct donation");
    } finally {
      setSubmittingDirect(false);
    }
  };

  const acceptedByAdmin = requests.filter(r => r.status === 'ACCEPTED' || r.status === 'VERIFIED');
  const myPledges = requests.filter(r => r.donorName === currentUser?.name);
  const completedDonations = myPledges.filter(r => r.status === 'COMPLETED');
  const inTransitCount = myPledges.filter(r => r.status === 'DISPATCHED' || r.status === 'FUNDED').length;

  const donorCards = [
    { label: 'Verified Needs', count: acceptedByAdmin.length, sub: 'Awaiting donors', icon: Heart, bg: 'bg-purple-50 text-purple-800', border: 'border-purple-200' },
    { label: 'My Total Pledges', count: myPledges.length, sub: 'Clients supported', icon: Coins, bg: 'bg-black text-white', border: 'border-slate-800' },
    { label: 'In Transit', count: inTransitCount, sub: 'Active deliveries', icon: Truck, bg: 'bg-blue-50 text-blue-800', border: 'border-blue-200' },
    { label: 'Delivered Impact', count: completedDonations.length, sub: 'Received safely', icon: CheckCircle2, bg: 'bg-emerald-50 text-emerald-800', border: 'border-emerald-200' },
  ];

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout} activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'home' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Donor Giving Dashboard</h1>
              <p className="text-xs text-slate-500 font-medium">Contribute supplies, review recipient feedback, and monitor delivery progress</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('new-donation')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Post Donation
              </button>
              <button 
                onClick={fetchNeeds} 
                className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {donorCards.map((c, idx) => {
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

          {/* Approved Needs Awaiting Supplies */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Approved Needs Awaiting Supplies</h2>
                <p className="text-[11px] text-slate-400">Pledge provisions to fulfill verified requests</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                {acceptedByAdmin.length} Open
              </span>
            </div>

            {acceptedByAdmin.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                No verified needs currently awaiting funding.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {acceptedByAdmin.map(r => (
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
                        <label className="font-bold text-slate-800 block">Donation Category (Type freely):</label>
                        <input 
                          required
                          value={donationType} 
                          onChange={(e) => setDonationType(e.target.value)} 
                          placeholder="e.g. Rice & Grains, Winter Clothes, First Aid"
                          className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
                        />
                        <div>
                          <label className="font-bold text-slate-800 block mb-1">Attach Item Proof Photo:</label>
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
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActiveReqId(r._id)}
                          className="flex-1 py-2.5 bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-slate-800 transition"
                        >
                          <Heart className="w-4 h-4" /> Accept & Donate Supplies
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Supported Clients Table with Recipient Reviews and Timelines */}
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
                      <th className="py-3 px-3">Assigned Volunteer</th>
                      <th className="py-3 px-3">Delivery Status</th>
                      <th className="py-3 px-3">Recipient Review</th>
                      <th className="py-3 px-3">Timeline Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {myPledges.map((m) => (
                      <tr key={m._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-3 font-mono text-[11px] font-bold text-slate-500">
                          #{m._id?.slice(-5)}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">
                          {m.recipientName}
                          <span className="block text-[10px] font-normal text-slate-400">{m.location}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-800">{m.itemName}</span>
                          <span className="block text-[10px] text-purple-700 font-bold">{m.donationType}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          {m.volunteerName ? (
                            <span className="font-semibold text-slate-800 flex items-center gap-1">
                              <Truck className="w-3.5 h-3.5 text-blue-600" /> {m.volunteerName}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Awaiting Volunteer</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          {m.status === 'COMPLETED' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> Handover Verified
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-600">{m.status}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          {m.status === 'COMPLETED' ? (
                            <div>
                              <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {m.reviewStars || 5} / 5
                              </div>
                              <p className="text-[10px] text-slate-600 italic mt-0.5">"{m.reviewComment || 'Handed over safely'}"</p>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">Pending delivery</span>
                          )}
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
          <div>
            <h2 className="text-lg font-black text-slate-900">Post New Donation Supply</h2>
            <p className="text-xs text-slate-400">Catalog resources directly to make them available for volunteer dispatch</p>
          </div>
          <form onSubmit={handleDirectDonationSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Item / Supplies Description</label>
              <input required value={newSupplyName} onChange={(e) => setNewSupplyName(e.target.value)} placeholder="e.g. 50x Canned Rations, 20x Winter Jackets" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantity</label>
                <input type="number" min="1" value={newSupplyQty} onChange={(e) => setNewSupplyQty(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category (Type your own)</label>
                <input 
                  required 
                  value={newSupplyCategory} 
                  onChange={(e) => setNewSupplyCategory(e.target.value)} 
                  placeholder="e.g. Food, Clothing, Medical, etc." 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none" 
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Pickup / Origin Hub</label>
              <input required value={newSupplyLocation} onChange={(e) => setNewSupplyLocation(e.target.value)} placeholder="e.g. South Depot Warehouse, Dock 2" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Notes</label>
              <textarea value={newSupplyNotes} onChange={(e) => setNewSupplyNotes(e.target.value)} placeholder="Additional storage or transport instructions..." className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none"></textarea>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Supply Photo:</label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-xs" />
              {photo && <img src={photo} alt="Preview" className="w-20 h-20 object-cover rounded-xl mt-2 border" />}
            </div>
            <button type="submit" disabled={submittingDirect} className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-slate-800 shadow-md">
              {submittingDirect ? 'Cataloging...' : 'Catalog Supply into Relay'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'chat' && <LiveRelayChat currentUser={currentUser} />}
    </AppLayout>
  );
}