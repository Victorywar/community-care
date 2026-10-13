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
  Users,
  CheckCircle2,
  X,
  PackageCheck
} from 'lucide-react';

export default function DonorDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReqId, setActiveReqId] = useState(null);
  const [donationType, setDonationType] = useState('Clothing');
  const [photo, setPhoto] = useState('');

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
        donationType,
        photo
      });
      setActiveReqId(null);
      setPhoto('');
      fetchNeeds();
      alert("நீங்கள் இந்த கோரிக்கையை ஏற்றுக்கொண்டீர்கள்! வாலண்டியருக்கு அனுப்பப்பட்டது.");
    } catch {
      alert("Error processing donor pledge");
    }
  };

  const acceptedByAdmin = requests.filter(r => r.status === 'ACCEPTED' || r.status === 'VERIFIED');
  const myPledges = requests.filter(r => r.donorName === currentUser?.name);
  const completedDonations = myPledges.filter(r => r.status === 'COMPLETED');

  const donorCards = [
    { label: 'Verified Needs', count: acceptedByAdmin.length, sub: 'உதவி கோரும் நபர்கள்', icon: Heart, bg: 'bg-purple-50 text-purple-800', border: 'border-purple-200' },
    { label: 'My Total Pledges', count: myPledges.length, sub: 'நான் உதவிய கிளைண்ட்ஸ்', icon: Coins, bg: 'bg-black text-white', border: 'border-slate-800' },
    { label: 'Delivered Impact', count: completedDonations.length, sub: 'கைக்கு சேர்ந்தது', icon: CheckCircle2, bg: 'bg-emerald-50 text-emerald-800', border: 'border-emerald-200' },
    { label: 'Supporter Tier', count: 'Gold Patron', sub: 'சரிபார்க்கப்பட்ட டோனார்', icon: Users, bg: 'bg-amber-50 text-amber-800', border: 'border-amber-200' },
  ];

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout} activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Donor Giving Dashboard</h1>
              <p className="text-xs text-slate-500 font-medium">அட்மின் ஒப்புதல் அளித்த கோரிக்கைகளை ஏற்று வழங்குங்கள் & உங்கள் டொனேஷன் ஹிஸ்டரி</p>
            </div>
            <button 
              onClick={fetchNeeds} 
              className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Feed</span>
            </button>
          </div>

          {/* Donor Stats Grid */}
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

          {/* Pending Approval / Accept Cards with Timeline & Action */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">டொனேஷனுக்கு தயாராக உள்ள தேவைகள் (Accept or Reject)</h2>
                <p className="text-[11px] text-slate-400">அட்மின் அப்ரூவ் செய்த உதவிகள் - நீங்கள் ஏற்றுக்கொண்டு பொருள் வழங்கலாம்</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                {acceptedByAdmin.length} Open
              </span>
            </div>

            {acceptedByAdmin.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                தற்போது எந்த கோரிக்கைகளும் நிலுவையில் இல்லை.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {acceptedByAdmin.map(r => (
                  <div key={r._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                        <p className="text-xs text-slate-500">{r.quantity} அலகுகள் • கேட்டவர்: {r.recipientName} ({r.location})</p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black text-white">
                        Admin Accepted
                      </span>
                    </div>

                    <OrderTimeline request={r} />

                    {activeReqId === r._id ? (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                        <label className="font-bold text-slate-800 block">நீங்கள் வழங்கும் பொருள் வகை:</label>
                        <select 
                          value={donationType} 
                          onChange={(e) => setDonationType(e.target.value)} 
                          className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="Clothes / Garments">உடைகள் (Clothes / Garments)</option>
                          <option value="Food & Rations">உணவு & தானியங்கள் (Food & Rations)</option>
                          <option value="Medicine & Health Kits">மருத்துவம் (Medicine & Health)</option>
                          <option value="Clean Water & Essentials">குடிநீர் & அத்தியாவசிய பொருட்கள்</option>
                        </select>
                        <div>
                          <label className="font-bold text-slate-800 block mb-1">பொருளின் புகைப்பட சான்று (Optional):</label>
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-xs" />
                          {photo && <img src={photo} alt="Pledge" className="w-16 h-16 object-cover rounded-lg border mt-2" />}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => setActiveReqId(null)} className="flex-1 py-2 font-bold border rounded-lg bg-slate-100">Cancel</button>
                          <button onClick={() => handleDonorAccept(r._id)} className="flex-1 py-2 bg-black text-white font-bold rounded-lg flex items-center justify-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Confirm & Route to Volunteer
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

          {/* Rows & Columns Table of Donated Clients under Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">நான் உதவி செய்த கிளைண்ட்ஸ் அட்டவணை (My Attended Clients & Donations)</h2>
                <p className="text-[11px] text-slate-400">நீங்கள் வழங்கிய உதவிகள், கொண்டு சேர்த்த வாலண்டியர் மற்றும் டெலிவரி நிலை</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                {myPledges.length} நபர்கள்
              </span>
            </div>

            {myPledges.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                நீங்கள் இதுவரை எந்த உதவிகளையும் ஏற்றுக்கொள்ளவில்லை. மேலே உள்ள தேவைகளை ஏற்று உதவலாம்!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50">
                      <th className="py-3 px-3">கிளைண்ட் / கேட்டவர்</th>
                      <th className="py-3 px-3">வழங்கிய பொருள்</th>
                      <th className="py-3 px-3">இடம்</th>
                      <th className="py-3 px-3">எடுத்துச் சென்ற வாலண்டியர்</th>
                      <th className="py-3 px-3">டெலிவரி நிலை</th>
                      <th className="py-3 px-3">வழங்கிய தேதி</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {myPledges.map((m) => (
                      <tr key={m._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-900">{m.recipientName}</td>
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-800">{m.itemName}</span>
                          <span className="block text-[10px] text-purple-700 font-bold">{m.donationType}</span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-500">{m.location}</td>
                        <td className="py-3.5 px-3">
                          {m.volunteerName ? (
                            <span className="font-bold text-blue-700">{m.volunteerName}</span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">பிக்அப் காத்திருக்கிறது</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            m.status === 'DISPATCHED' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {m.status === 'COMPLETED' ? 'சேர்ந்துவிட்டது' : m.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-[10px] text-slate-400">
                          {new Date(m.updatedAt || m.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
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

      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 pb-2 border-b border-slate-200">All Requisition Timelines</h2>
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