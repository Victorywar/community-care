import React, { useState } from 'react';
import { X, HeartHandshake, MapPin, Calendar, AlertCircle, Package } from 'lucide-react';

export default function DonateModal({ isOpen, onClose, selectedRequest, onSubmitDonation }) {
  const [formData, setFormData] = useState({
    category: selectedRequest ? selectedRequest.category : 'Food',
    item: selectedRequest ? selectedRequest.title : '',
    quantity: selectedRequest ? selectedRequest.quantity : '',
    pickupLocation: 'Greenways Road, RA Puram',
    preferredDate: '',
    donorNotes: '',
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.item || !formData.quantity || !formData.pickupLocation || !formData.preferredDate) {
      setError('Please provide all pickup and item details.');
      return;
    }

    onSubmitDonation({
      id: `DON-${Math.floor(1000 + Math.random() * 9000)}`,
      matchedReqId: selectedRequest ? selectedRequest.id : null,
      recipientName: selectedRequest ? selectedRequest.receiverName : 'Open Community Pool',
      recipientLocation: selectedRequest ? selectedRequest.location : 'Community Warehouse',
      category: formData.category,
      item: formData.item,
      quantity: formData.quantity,
      pickupLocation: formData.pickupLocation,
      status: 'ASSIGNED',
      volunteer: 'Kavitha Raman (Field Volunteer)',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#0b1329] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <HeartHandshake size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {selectedRequest ? `Fulfill Request: ${selectedRequest.id}` : 'Schedule Direct Donation'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {selectedRequest ? `Recipient: ${selectedRequest.receiverName}` : 'Contribute essential aid items to the community pool'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Item Category & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <input
                type="text"
                readOnly={!!selectedRequest}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Donation Item *
              </label>
              <input
                type="text"
                required
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                placeholder="e.g. 5kg Basmati Rice + Pulses"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Quantity & Pickup Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Quantity Pledged *
              </label>
              <input
                type="text"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g. 10 Grocery Kits"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Pickup Date *
              </label>
              <input
                type="date"
                required
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Pickup Address (Donor Location) *
            </label>
            <input
              type="text"
              required
              value={formData.pickupLocation}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              placeholder="Door No, Street Name, Donor City"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          {/* Donor Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Packaging / Volunteer Handover Instructions
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Packed in sealed cardboard boxes. Security gate code is 4421."
              value={formData.donorNotes}
              onChange={(e) => setFormData({ ...formData, donorNotes: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            ></textarea>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Confirm Donation & Dispatch
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}