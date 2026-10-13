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
  CheckCircle2,
  XCircle,
  Truck
} from 'lucide-react';

export default function RecipientDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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
    { label: 'Total Requests', count: myRequests.length, sub: 'All aid requests', icon: HeartHandshake, bg: 'bg-black text-white', border: 'border-slate-800' },
    { label: 'Pending Review', count: pendingCount, sub: 'Admin audit queue', icon: Clock, bg: 'bg-amber-50 text-amber-800', border: 'border-amber-200' },
    { label: 'In Transit', count: transitCount, sub: 'Volunteer en route', icon: ShieldAlert, bg: 'bg-blue-50 text-blue-800', border: 'border-blue-200' },
    { label: 'Items Received', count: deliveredCount, sub: 'Completed deliveries', icon: PackageCheck, bg: 'bg-emerald-50 text-emerald-800', border: 'border-emerald-200' },
  ];

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout} activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'home' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Receiver Aid Tracker</h1>
              <p className="text-xs text-slate-500 font-medium">Live track verification, donor pledges, and delivery status</p>
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

          {/* Clean Box Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Requisitions & Pipeline Tracking Table</h2>
                <p className="text-[11px] text-slate-400">Detailed records of requests, approvals, assigned volunteers, and handovers</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                {myRequests.length} Records
              </span>
            </div>

            {myRequests.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <AlertCircle className="w-7 h-7 mx-auto mb-2 text-slate-300" />
                No aid requests recorded yet. Click "Request Aid" to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50">
                      <th className="py-3 px-3">Req ID</th>
                      <th className="py-3 px-3">Item & Qty</th>
                      <th className="py-3 px-3">Admin Status</th>
                      <th className="py-3 px-3">Donor Details</th>
                      <th className="py-3 px-3">Assigned Volunteer</th>
                      <th className="py-3 px-3">Delivery Status</th>
                      <th className="py-3 px-3">Updated At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {myRequests.map((r) => {
                      const isFunded = r.status === 'FUNDED' || r.status === 'DISPATCHED' || r.status === 'COMPLETED';
                      const isDispatched = r.status === 'DISPATCHED' || r.status === 'COMPLETED';
                      const isCompleted = r.status === 'COMPLETED';

                      return (
                        <tr key={r._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-3 font-mono text-[11px] font-bold text-slate-500">
                            #{r._id?.slice(-5)}
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              {r.recipientPhoto && (
                                <img src={r.recipientPhoto} alt="item" className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                              )}
                              <div>
                                <span className="block font-bold">{r.itemName}</span>
                                <span className="text-[10px] text-slate-400">{r.quantity} units • {r.location}</span>
                              </div>
                            </div>
                          </td>
                          
                          {/* Clean Admin Status with Green Tick */}
                          <td className="py-3.5 px-3">
                            {r.status === 'PENDING' ? (
                              <span className="inline-flex items-center gap-1.5 text-amber-600 font-semibold text-[11px]">
                                <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending Audit
                              </span>
                            ) : r.status === 'REJECTED' ? (
                              <span className="inline-flex items-center gap-1.5 text-rose-600 font-semibold text-[11px]">
                                <XCircle className="w-3.5 h-3.5 text-rose-500" /> Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                                <span>Approved</span>
                                <span className="text-[10px] text-slate-400 font-normal">({r.verifiedBy || 'Admin Control'})</span>
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-3">
                            {isFunded ? (
                              <div>
                                <p className="font-bold text-slate-800 text-[11px]">{r.donorName || 'Verified Donor'}</p>
                                <p className="text-[10px] text-purple-700 font-semibold">{r.donationType || 'Supplies'}</p>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Awaiting Donor</span>
                            )}
                          </td>

                          <td className="py-3.5 px-3">
                            {isDispatched ? (
                              <div>
                                <p className="font-bold text-blue-700 text-[11px] flex items-center gap-1">
                                  <Truck className="w-3 h-3" /> {r.volunteerName || 'Fleet Runner'}
                                </p>
                                <p className="text-[10px] text-slate-400">{r.pickupLocation || 'Central Depot'}</p>
                              </div>
                            ) : isFunded ? (
                              <span className="text-[10px] text-amber-600 font-semibold">Ready for Pickup</span>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Not Assigned</span>
                            )}
                          </td>

                          <td className="py-3.5 px-3">
                            {isCompleted ? (
                              <div>
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> Delivered & Signed
                                </span>
                                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {r.reviewStars || 5} / 5
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-500">{r.status}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-[10px] text-slate-400">
                            {new Date(r.updatedAt || r.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
            <p className="text-xs text-slate-400">Submit a requisition with photo reference for immediate verification</p>
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