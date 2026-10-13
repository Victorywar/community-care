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
  Package, 
  Coins, 
  Users,
  CheckCircle2
} from 'lucide-react';

export default function DonorDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationPhoto, setDonationPhoto] = useState('');
  const [activeReqId, setActiveReqId] = useState(null);

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
    reader.onloadend = () => setDonationPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDonate = async (id) => {
    try {
      await api.updateTimelineStep(id, {
        action: 'DONATE',
        actor: currentUser?.name || 'Verified Donor',
        photo: donationPhoto
      });
      setDonationPhoto('');
      setActiveReqId(null);
      fetchNeeds();
    } catch {
      alert("Error funding item");
    }
  };

  const verifiedNeeds = requests.filter(r => r.status === 'VERIFIED');
  const myDonations = requests.filter(r => r.donorName === currentUser?.name);
  const completedDonations = myDonations.filter(r => r.status === 'COMPLETED');

  const donorCards = [
    { label: 'Verified Needs', count: verifiedNeeds.length, sub: 'Needs community funding', icon: Heart, bg: 'bg-purple-50 text-purple-800', border: 'border-purple-200' },
    { label: 'My Total Pledges', count: myDonations.length, sub: 'Packages contributed', icon: Coins, bg: 'bg-black text-white', border: 'border-slate-800' },
    { label: 'Delivered Impact', count: completedDonations.length, sub: 'Reached recipients safely', icon: CheckCircle2, bg: 'bg-emerald-50 text-emerald-800', border: 'border-emerald-200' },
    { label: 'Community Tier', count: 'Gold Patron', sub: 'Verified Contributor', icon: Users, bg: 'bg-amber-50 text-amber-800', border: 'border-amber-200' },
  ];

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout} activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Donor Giving Center</h1>
              <p className="text-xs text-slate-500 font-medium">Fund verified relief needs, upload package proof & follow live delivery</p>
            </div>
            <button onClick={fetchNeeds} className="p-2.5 bg-black text-white rounded-xl hover:bg-slate-800 transition">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Stat Cards */}
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

          {/* Verified Needs Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Verified Relief Needs Ready for Funding</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                {verifiedNeeds.length} Urgent Needs
              </span>
            </div>

            {verifiedNeeds.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                <AlertCircle className="w-7 h-7 mx-auto mb-2 text-slate-300" />
                No verified needs currently awaiting funding.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verifiedNeeds.map(r => (
                  <div key={r._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                        <p className="text-xs text-slate-400">{r.quantity} units • Requested by: {r.recipientName}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Audit Passed
                      </span>
                    </div>

                    <OrderTimeline request={r} />

                    {activeReqId === r._id ? (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                        <label className="font-bold text-slate-800 block">Attach Package / Receipt Photo Proof:</label>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-xs" />
                        {donationPhoto && <img src={donationPhoto} alt="Proof" className="w-16 h-16 object-cover rounded-lg border mt-2" />}
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => setActiveReqId(null)} className="flex-1 py-2 text-xs border rounded-xl font-bold bg-slate-100">Cancel</button>
                          <button onClick={() => handleDonate(r._id)} className="flex-1 py-2 text-xs bg-black text-white font-bold rounded-xl flex items-center justify-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Confirm Funding
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setActiveReqId(r._id)}
                        className="w-full py-2.5 bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-slate-800"
                      >
                        <Heart className="w-4 h-4" /> Fund this Need & Attach Photo
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'my-donations' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 pb-2 border-b border-slate-200">My Contributed Provisions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {myDonations.map(m => (
              <div key={m._id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-slate-800">{m.itemName}</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{m.status}</span>
                </div>
                <OrderTimeline request={m} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 pb-2 border-b border-slate-200">Live Community Timelines</h2>
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