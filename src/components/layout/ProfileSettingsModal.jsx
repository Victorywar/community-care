import React, { useState } from 'react';
import { Camera, X, Check, User, Phone, MapPin, Mail } from 'lucide-react';
import { api } from '../../services/api';

export default function ProfileSettingsModal({ isOpen, onClose, currentUser, onProfileUpdated }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateProfile({
        email: currentUser.email,
        name,
        phone,
        address,
        avatar
      });
      if (onProfileUpdated) onProfileUpdated(updated);
      onClose();
    } catch (err) {
      alert("Failed saving profile changes: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Account & Profile Settings</h3>
            <p className="text-[11px] text-slate-500">Edit credentials, role details, and profile photo</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center pb-2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="Profile DP" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-2">Tap camera icon to update DP</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email (Account Identifier)</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 text-slate-500">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input disabled value={currentUser?.email || ''} className="w-full bg-transparent focus:outline-none cursor-not-allowed" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98400..." className="w-full focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dispatch / Home Address</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Sector 4, West Block..." className="w-full focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}