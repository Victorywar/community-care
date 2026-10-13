import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import OrderTimeline from '../../components/common/OrderTimeline';
import { api } from '../../services/api';
import { Heart, Camera, RefreshCw, AlertCircle, Check } from 'lucide-react';

export default function DonorDashboard({ currentUser, onLogout }) {
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
    } catch (err) {
      alert("Error funding item");
    }
  };

  const verifiedNeeds = requests.filter(r => r.status === 'VERIFIED');
  const myDonations = requests.filter(r => r.donorName === currentUser?.name);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <Header currentUser={currentUser} onLogout={onLogout} activeTitle="Donor Platform" />

      <main className="max-w-xl mx-auto p-4 space-y-6">
        {/* Section Heading */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-black text-slate-900">Verified Relief Needs</h2>
            <p className="text-xs text-slate-400">Admin-verified requests waiting for donor funding</p>
          </div>
          <button onClick={fetchNeeds} className="p-2 bg-white border border-slate-200 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {verifiedNeeds.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
            No verified aid requests open right now.
          </div>
        ) : (
          verifiedNeeds.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                  <p className="text-xs text-slate-400">{r.quantity} units requested by {r.recipientName}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Ready to Fund
                </span>
              </div>

              {/* Order Timeline Preview */}
              <OrderTimeline request={r} />

              {/* Photo Attachment & Donate Button */}
              {activeReqId === r._id ? (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
                  <label className="text-xs font-bold text-purple-900 block">Attach Package / Contribution Photo Proof:</label>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white" />
                  {donationPhoto && <img src={donationPhoto} alt="Proof" className="w-16 h-16 object-cover rounded-lg border mt-2" />}
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setActiveReqId(null)} className="flex-1 py-2 text-xs border rounded-xl font-bold bg-white">Cancel</button>
                    <button onClick={() => handleDonate(r._id)} className="flex-1 py-2 text-xs bg-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Confirm Donation
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setActiveReqId(r._id)}
                  className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-purple-700"
                >
                  <Heart className="w-4 h-4" /> Fund this Request & Attach Photo
                </button>
              )}
            </div>
          ))
        )}

        {/* My Contributed Pipeline Timeline */}
        {myDonations.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">My Funded Contributions Timeline</h3>
            {myDonations.map(m => (
              <div key={m._id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-800">{m.itemName}</span>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{m.status}</span>
                </div>
                <OrderTimeline request={m} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}