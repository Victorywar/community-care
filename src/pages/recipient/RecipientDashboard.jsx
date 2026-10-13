import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import OrderTimeline from '../../components/common/OrderTimeline';
import LiveRelayChat from '../admin/LiveRelayChat';
import { api } from '../../services/api';
import { PlusCircle, RefreshCw, AlertCircle, Star } from 'lucide-react';

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

  return (
    <AppLayout currentUser={currentUser} onLogout={onLogout} activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'home' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-black text-slate-900">My Requisition Pipeline</h2>
              <p className="text-xs text-slate-400">Live aid requests tracked across the community supply chain</p>
            </div>
            <button onClick={fetchMyRequests} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No active requisitions yet</p>
              <button 
                onClick={() => setActiveTab('new-request')}
                className="mt-3 px-4 py-2 bg-black text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Create First Requisition
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {requests.map(r => (
                <div key={r._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{r.itemName}</h3>
                      <p className="text-xs text-slate-400">{r.quantity} units • Dest: {r.location}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {r.status}
                    </span>
                  </div>

                  <OrderTimeline request={r} />

                  {r.status === 'COMPLETED' && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                      <span className="font-semibold">Handover Verified</span>
                      <span className="flex items-center gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {r.reviewStars} / 5
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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

      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 pb-2 border-b border-slate-200">Requisition Timelines</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {requests.map(r => (
              <div key={r._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
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