import React, { useState } from 'react';
import { X, Camera, CheckCircle2, AlertCircle, FileText, User } from 'lucide-react';

export default function ProofOfDeliveryModal({ isOpen, onClose, delivery, onConfirmDelivery }) {
  const [photoPreview, setPhotoPreview] = useState(
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80'
  );
  const [receiverConfirmation, setReceiverConfirmation] = useState('');
  const [notes, setNotes] = useState('Delivered directly to recipient. Package verified in good condition.');
  const [error, setError] = useState('');

  if (!isOpen || !delivery) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!receiverConfirmation.trim()) {
      setError('Please enter the name of the person who acknowledged receipt.');
      return;
    }

    onConfirmDelivery(delivery.id, {
      proofPhoto: photoPreview,
      receivedBy: receiverConfirmation,
      notes,
      deliveredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-[#0b1329] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Proof of Delivery (PoD)</h3>
              <p className="text-[11px] text-slate-300">Complete verification for {delivery.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Delivery Photo Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Handover Verification Photo
            </label>
            <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 h-44 flex items-center justify-center group">
              <img 
                src={photoPreview} 
                alt="Proof of Delivery Preview" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-xs font-semibold text-white bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  Verified Handover Photo Loaded
                </span>
              </div>
            </div>
          </div>

          {/* Recipient Confirmation Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Recipient Name / Acknowledged By *
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={receiverConfirmation}
                onChange={(e) => setReceiverConfirmation(e.target.value)}
                placeholder={`e.g. ${delivery.recipientName} (or Authorized Family Member)`}
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Verification Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Volunteer Delivery Notes
            </label>
            <div className="relative">
              <FileText size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              ></textarea>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>Submit Proof & Complete</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}