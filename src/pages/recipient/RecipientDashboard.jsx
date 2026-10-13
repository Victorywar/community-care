import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import OrderTimeline from '../../components/common/OrderTimeline';
import { api } from '../../services/api';
import { PlusCircle, Camera, Check, Star, RefreshCw } from 'lucide-react';

export default function RecipientDashboard({ currentUser, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('1');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMyRequests = async () => {
    try {
      const data = await api.getRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setRequests([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.trim()) return;
    setSubmitting(true);
    try {
      await api.createRequest({
        itemName: item,
        quantity: parseInt(qty) || 1,
        description: desc,
        location: location || 'Local Ward',
        recipientName: currentUser?.name || 'Receiver',
        recipientPhoto: photo
      });
      setItem(''); setDesc(''); setLocation(''); setPhoto('');
      setShowModal(false);
      fetchMyRequests();
    } catch {
      alert("Error submitting request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <Header currentUser={currentUser} onLogout={onLogout} activeTitle="Recipient Platform" />

      <main className="max-w-xl mx-auto p-4 space-y-6">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-5 rounded-3xl shadow-lg space-y-3">
          <h2 className="text-base font-black">Need Essential Relief or Supplies?</h2>
          <p className="text-xs text-blue-100">Submit an aid requisition with photos to be verified by administrators.</p>
          <button 
            onClick={() => setShowModal(true)} 
            className="w-full py-3 bg-white text-blue-600 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Create New Requisition with Photo
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-black text-sm text-slate-900">My Requisition Timelines</h3>
            <button onClick={fetchMyRequests} className="p-1.5 bg-white border border-slate-200 rounded-lg">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              You have no active requests. Tap the button above to request aid.
            </div>
          ) : (
            requests.map(r => (
              <div key={r._id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{r.itemName}</h4>
                    <p className="text-xs text-slate-400">{r.quantity} units • {r.location}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {r.status}
                  </span>
                </div>

                <OrderTimeline request={r} />

                {r.status === 'COMPLETED' && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <span>Delivered & Verified</span>
                    <span className="flex items-center gap-1 font-bold"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {r.reviewStars} / 5</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Requisition Form */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-3 shadow-2xl">
              <h3 className="font-bold text-sm text-slate-900">New Requisition</h3>
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Item Required</label>
                  <input required value={item} onChange={(e) => setItem(e.target.value)} placeholder="Food Box, Medicine, Water..." className="w-full p-2.5 rounded-xl border border-slate-200" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity</label>
                  <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Delivery Address</label>
                  <input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Sector 2, South Camp..." className="w-full p-2.5 rounded-xl border border-slate-200" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Photo Reference (Optional):</label>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-xs" />
                  {photo && <img src={photo} alt="Preview" className="w-16 h-16 object-cover rounded-xl mt-2 border" />}
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-xl border font-bold">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-xl">{submitting ? 'Submitting...' : 'Post Requisition'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}