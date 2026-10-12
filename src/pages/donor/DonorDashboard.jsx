import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DonorSidebar from '../../components/donor/DonorSidebar';
import LiveRelayChat from '../admin/LiveRelayChat';
import VerticalTimeline from '../../components/common/VerticalTimeline';
import { Plus, HeartHandshake, ShieldCheck, Upload, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function DonorDashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('ledger');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [formData, setFormData] = useState({
    category: 'RATION_KIT',
    itemName: '',
    totalQuantity: '',
    unit: 'Bags',
    qualityGrade: 'NEW_SEALED',
    estimatedValue: '',
    photoUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await api.getDonations();
      if (Array.isArray(res)) {
        setDonations(res);
        if (res.length > 0 && !expandedId) {
          setExpandedId(res[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        setFormData(prev => ({ ...prev, photoUrl: compressedBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemName || !formData.totalQuantity) return;

    try {
      setSubmitting(true);
      const res = await api.createDonation(formData);
      if (res && res._id) {
        setIsModalOpen(false);
        setFormData({
          category: 'RATION_KIT',
          itemName: '',
          totalQuantity: '',
          unit: 'Bags',
          qualityGrade: 'NEW_SEALED',
          estimatedValue: '',
          photoUrl: ''
        });
        await fetchDonations();
      }
    } catch (err) {
      console.error('Error logging contribution:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const fulfilledCount = donations.filter(d => d.status === 'FULFILLED').length;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <DonorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-sm font-black text-slate-800 tracking-tight">Donor Portal</h1>
            <p className="text-[10px] text-slate-400">Track relief contributions and live delivery progress</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#080d1d] hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Make a Contribution</span>
          </button>
        </header>

        <div className="p-6 max-w-5xl w-full mx-auto space-y-6">
          {activeTab === 'relay' ? (
            <LiveRelayChat />
          ) : activeTab === 'receipts' ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-slate-900">Verified Impact Receipts</h2>
              {fulfilledCount === 0 ? (
                <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl text-center text-xs text-slate-400">
                  Receipts will unlock once your assigned volunteer fulfills delivery on the ground.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {donations.filter(d => d.status === 'FULFILLED').map(d => (
                    <div key={d._id} className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          RCP-{d.donationId || d._id.slice(-5)}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold">VERIFIED</span>
                      </div>
                      <p className="text-xs font-black text-slate-900">{d.itemName}</p>
                      <p className="text-[11px] text-slate-500">Delivered by {d.assignedVolunteer || 'Field Volunteer'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">My Total Contributions</span>
                  <p className="text-3xl font-black text-slate-900 mt-1">{donations.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Deliveries</span>
                  <p className="text-3xl font-black text-[#2ecc71] mt-1">{fulfilledCount}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Telemetry Tracking</span>
                  <p className="text-xs font-bold text-[#2ecc71] mt-3 flex items-center gap-1">
                    <ShieldCheck size={14} /> Real-Time Pipeline Synchronized
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h2 className="text-base font-black text-slate-900">Active Contribution Tracker</h2>

                {loading ? (
                  <p className="text-center py-10 text-xs text-slate-400">Loading ledger data...</p>
                ) : donations.length === 0 ? (
                  <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl text-center space-y-2">
                    <HeartHandshake size={32} className="mx-auto text-slate-300" />
                    <p className="text-xs font-bold text-slate-500">No contributions logged yet</p>
                    <p className="text-[11px] text-slate-400">Tap "+ Make a Contribution" above to log supplies or funds.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {donations.map((don) => {
                      const isExpanded = expandedId === don._id;

                      return (
                        <div key={don._id} className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
                          <div 
                            onClick={() => setExpandedId(isExpanded ? null : don._id)}
                            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                          >
                            <div className="flex items-center gap-3.5">
                              {don.photoUrl ? (
                                <img src={don.photoUrl} alt={don.itemName} className="w-13 h-13 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0" />
                              ) : (
                                <div className="w-13 h-13 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                                  <HeartHandshake size={22} />
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                    {don.donationId || don._id.slice(-6)}
                                  </span>
                                  <h3 className="text-sm font-black text-slate-900">{don.itemName}</h3>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {don.totalQuantity} {don.unit} • {don.qualityGrade}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-auto">
                              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-[#2ecc71] border border-emerald-200">
                                {don.status || 'LOGGED'}
                              </span>
                              {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                              <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3">Order details</h5>
                              <VerticalTimeline 
                                status={don.status} 
                                createdAt={don.createdAt} 
                                assignedVolunteer={don.assignedVolunteer}
                                donationId={don.donationId || don._id.slice(-5)}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Make a Relief Contribution</h3>
                <p className="text-xs text-slate-400 mt-0.5">Specify supplies, quality grade, and photo proofs</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="RATION_KIT">Dry Ration & Food Kits</option>
                  <option value="MEDICAL_SUPPLIES">Emergency Medicine & First Aid</option>
                  <option value="CLOTHING">Warm Clothes & Blankets</option>
                  <option value="FINANCIAL">Direct Financial Grant</option>
                  <option value="OTHER">Other Relief Equipment</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Item Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50kg Rice Bags, 10 First Aid Kits"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity / Count</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 25"
                    value={formData.totalQuantity}
                    onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="Bags / Kits / Boxes"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quality Grade</label>
                  <select
                    value={formData.qualityGrade}
                    onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="NEW_SEALED">New / Sealed</option>
                    <option value="EXCELLENT">Excellent Condition</option>
                    <option value="STANDARD_GRADE">Standard Grade</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimated Value (₹)</label>
                  <input
                    type="number"
                    placeholder="Optional ₹ amount"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Upload Photo Proof</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-600 font-semibold">
                    <Upload size={14} />
                    <span>Choose Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {formData.photoUrl && (
                    <img src={formData.photoUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#080d1d] hover:bg-slate-800 text-white rounded-xl font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {submitting ? 'Recording...' : 'Submit Contribution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
