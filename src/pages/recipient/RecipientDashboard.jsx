import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import LiveRelayChat from '../admin/LiveRelayChat';
import { api } from '../../services/api';
import { 
  PlusCircle, 
  RefreshCw, 
  AlertCircle, 
  Star, 
  Clock, 
  HeartHandshake, 
  PackageCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';

export default function RecipientDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('1');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMyRequests = async () => {
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

  useEffect(() => { fetchMyRequests(); }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!item.trim()) return;
    setSubmitting(true);
    try {
      await api.createRequest({
        itemName: item,
        quantity: parseInt(qty) || 1,
        description: desc,
        location: location || 'Field Sector',
        recipientName: currentUser?.name || 'Receiver',
        recipientPhoto: photo
      });
      setItem(''); setDesc(''); setLocation(''); setPhoto('');
      setActiveTab('home');
      fetchMyRequests();
    } catch {
      alert("Error submitting request");
    } finally {
      setSubmitting(false);
    }
  };

  const myRequests = requests.filter(r => r.recipientName === currentUser?.name || !r.recipientName);
  const pendingCount = myRequests.filter(r => r.status === 'PENDING').length;
  const transitCount = myRequests.filter(r => r.status === 'DISPATCHED' || r.status === 'FUNDED').length;
  const deliveredCount = myRequests.filter(r => r.status === 'COMPLETED').length;

  const receiverCards = [
    { label: 'Total Requisitions', count: myRequests.length, sub: 'கேட்ட மொத்த உதவிகள்', icon: HeartHandshake, bg: 'bg-black text-white', border: 'border-slate-800' },
    { label: 'Admin Pending', count: pendingCount, sub: 'அட்மின் சரிபார்ப்பில்', icon: Clock, bg: 'bg-amber-50 text-amber-800', border: 'border-amber-200' },
    { label: 'In Transit', count: transitCount, sub: 'வாலண்டியர் வழியில்', icon: ShieldAlert, bg: 'bg-blue-50 text-blue-800', border: 'border-blue-200' },
    { label: 'Items Received', count: deliveredCount, sub: 'பொருள் வந்துவிட்டது', icon: PackageCheck, bg: 'bg-emerald-50 text-emerald-800', border: 'border-emerald-200' },
  ];

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout} activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Receiver Aid Tracker</h1>
              <p className="text-xs text-slate-500 font-medium">உங்களின் உதவி கோரிக்கைகள் மற்றும் பொருட்கள் கிடைத்த விபரம் (Rows & Columns)</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('new-request')}
                className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Request Aid
              </button>
              <button onClick={fetchMyRequests} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Receiver Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {receiverCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className={`p-4 rounded-2xl border ${c.border} ${c.bg} shadow-xs flex flex-col justify-between`}>
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

          {/* Rows & Columns Table Format */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">எனது உதவி கோரிக்கைகள் அட்டவணை (Requisitions Status Table)</h2>
                <p className="text-[11px] text-slate-400">அட்மின் அப்ரூவல், டோனார் சப்ளை மற்றும் வாலண்டியர் டெலிவரி விபரம்</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                {myRequests.length} பதிவுகள்
              </span>
            </div>

            {myRequests.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <AlertCircle className="w-7 h-7 mx-auto mb-2 text-slate-300" />
                நீங்கள் இதுவரை எந்த உதவி கோரிக்கையையும் பதிவு செய்யவில்லை.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50">
                      <th className="py-3 px-3">பொருள் & அளவு</th>
                      <th className="py-3 px-3">அட்மின் ஒப்புதல்</th>
                      <th className="py-3 px-3">டோனார் விபரம்</th>
                      <th className="py-3 px-3">வாலண்டியர் டிரான்சிட்</th>
                      <th className="py-3 px-3">பொருள் கிடைத்துவிட்டதா?</th>
                      <th className="py-3 px-3">தேதி & நேரம்</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {myRequests.map((r) => {
                      const isAdminAccepted = r.status !== 'PENDING' && r.status !== 'REJECTED';
                      const isFunded = r.status === 'FUNDED' || r.status === 'DISPATCHED' || r.status === 'COMPLETED';
                      const isDispatched = r.status === 'DISPATCHED' || r.status === 'COMPLETED';
                      const isCompleted = r.status === 'COMPLETED';

                      return (
                        <tr key={r._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-3 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              {r.recipientPhoto && (
                                <img src={r.recipientPhoto} alt="item" className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                              )}
                              <div>
                                <span className="block font-bold">{r.itemName}</span>
                                <span className="text-[10px] text-slate-400">{r.quantity} அலகுகள் ({r.location})</span>
                              </div>
                            </div>
                          </td>

                          {/* Admin Verification Column */}
                          <td className="py-3.5 px-3">
                            {r.status === 'PENDING' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3 h-3" /> Waiting Audit
                              </span>
                            ) : r.status === 'REJECTED' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <XCircle className="w-3 h-3" /> Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black text-white">
                                <CheckCircle className="w-3 h-3" /> Accepted ({r.verifiedBy || 'Admin'})
                              </span>
                            )}
                          </td>

                          {/* Donor Detail Column */}
                          <td className="py-3.5 px-3">
                            {isFunded ? (
                              <div>
                                <p className="font-bold text-slate-800 text-[11px]">{r.donorName || 'Verified Donor'}</p>
                                <p className="text-[10px] text-purple-700 font-semibold">{r.donationType || 'Supplies'}</p>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">டோனார் இன்னும் எடுக்கவில்லை</span>
                            )}
                          </td>

                          {/* Volunteer Transit Column */}
                          <td className="py-3.5 px-3">
                            {isDispatched ? (
                              <div>
                                <p className="font-bold text-blue-700 text-[11px] flex items-center gap-1">
                                  <Truck className="w-3 h-3" /> {r.volunteerName || 'Fleet Runner'}
                                </p>
                                <p className="text-[10px] text-slate-400">{r.pickupLocation || 'Central Depot'}</p>
                              </div>
                            ) : isFunded ? (
                              <span className="text-[10px] text-amber-600 font-semibold">வாலண்டியர் பிக்கப்பிற்கு தயார்</span>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">பிக்அப் ஆகவில்லை</span>
                            )}
                          </td>

                          {/* Received Status Column */}
                          <td className="py-3.5 px-3">
                            {isCompleted ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <CheckCircle className="w-3 h-3" /> வந்து சேர்ந்தது (Delivered)
                                </span>
                                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                                  <Star className="w-3 h-3 fill-amber-400" /> {r.reviewStars || 5} / 5 ரேட்டிங்
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400">இன்னும் வரவில்லை</span>
                            )}
                          </td>

                          {/* Date Column */}
                          <td className="py-3.5 px-3 text-[10px] text-slate-400">
                            {new Date(r.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'new-request' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Request Relief or Food Aid</h2>
            <p className="text-xs text-slate-400">Submit a requisition with photo reference for immediate admin verification</p>
          </div>
          <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Item Required</label>
              <input required value={item} onChange={(e) => setItem(e.target.value)} placeholder="e.g. Rice 10kg, Emergency Food Box, Water" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Quantity (Units)</label>
              <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Delivery Location</label>
              <input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Sector 4, Relief Camp 2" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Urgent Notes</label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Provide any details about immediate urgency..." className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none"></textarea>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Attach Item Reference Photo (Optional):</label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-xs" />
              {photo && <img src={photo} alt="Preview" className="w-20 h-20 object-cover rounded-xl mt-2 border" />}
            </div>
            <button type="submit" disabled={submitting} className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-slate-800 shadow-md">
              {submitting ? 'Submitting...' : 'Post Requisition to Community Chain'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'chat' && <LiveRelayChat currentUser={currentUser} />}
    </AppLayout>
  );
}