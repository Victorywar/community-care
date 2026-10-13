import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import OrderTimeline from '../../components/common/OrderTimeline';
import LiveRelayChat from '../admin/LiveRelayChat';
import { api } from '../../services/api';
import { Heart, RefreshCw, AlertCircle, Check } from 'lucide-react';

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

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout} activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'home' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-black text-slate-900">Verified Relief Needs Waiting for Donors</h2>
              <p className="text-xs text-slate-400">Admin-audited community requisitions open for supply funding</p>
            </div>
            <button onClick={fetchNeeds} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {verifiedNeeds.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No verified aid requisitions awaiting donors</p>
              <p className="text-xs text-slate-400 mt-1">Once the administrator verifies incoming receiver requests, they will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {verifiedNeeds.map(r => (
                <div key={r._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                      <p className="text-xs text-slate-400">{r.quantity} units • Requested by: {r.recipientName}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Awaiting Donor
                    </span>
                  </div>

                  <OrderTimeline request={r} />

                  {activeReqId === r._id ? (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <label className="text-xs font-bold text-slate-800 block">Attach Package / Receipt Photo Proof:</label>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-xs" />
                      {donationPhoto && <img src={donationPhoto} alt="Proof" className="w-16 h-16 object-cover rounded-lg border mt-2" />}
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => setActiveReqId(null)} className="flex-1 py-2 text-xs border rounded-xl font-bold bg-white">Cancel</button>
                        <button onClick={() => handleDonate(r._id)} className="flex-1 py-2 text-xs bg-black text-white font-bold rounded-xl flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Confirm Funding
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setActiveReqId(r._id)}
                      className="w-full py-2.5 bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-slate-800"
                    >
                      <Heart className="w-4 h-4" /> Fund this Request & Attach Photo
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
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