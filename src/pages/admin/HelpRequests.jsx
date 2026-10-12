import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Search, 
  MapPin, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Truck, 
  Plus, 
  Clock, 
  Layers, 
  X,
  ShieldCheck
} from 'lucide-react';

export default function HelpRequests() {
  const { requests, addRequest, updateRequestStatus } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Timeline drawer state
  const [selectedReq, setSelectedReq] = useState(null);
  
  // Create request modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    recipientName: '',
    location: '',
    quantity: '',
    category: 'Food Kits',
    urgency: 'High',
    description: ''
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title || !form.recipientName) return;
    addRequest(form);
    setForm({
      title: '',
      recipientName: '',
      location: '',
      quantity: '',
      category: 'Food Kits',
      urgency: 'High',
      description: ''
    });
    setIsModalOpen(false);
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      (req.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.recipientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Help Requests Console</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time dispatch workflow with end-to-end audit ledger tracking</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#080d1d] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Plus size={16} />
          <span>New Aid Request</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ticket title, recipient or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'FULFILLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                statusFilter === tab
                  ? 'bg-[#080d1d] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
          <AlertCircle size={36} className="mx-auto text-slate-300 mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No requests in database</h3>
          <p className="text-xs text-slate-500 mt-1">Click "New Aid Request" above to log a real community ticket.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{item.id}</span>
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${
                    item.status === 'FULFILLED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    item.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
              </div>

              <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600">
                <div className="flex items-center gap-2">
                  <User size={13} className="text-slate-400" />
                  <span className="font-bold text-slate-800">{item.recipientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-slate-400" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 border-t border-slate-200/60">
                  <span>Qty: <strong className="text-slate-800">{item.quantity}</strong></span>
                  <span>{item.category}</span>
                </div>
              </div>

              {/* Action Buttons & Timeline Inspector */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {item.status === 'PENDING' && (
                    <button
                      onClick={() => updateRequestStatus(item.id, 'IN_PROGRESS')}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Truck size={13} /> Dispatch Unit
                    </button>
                  )}
                  {item.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => updateRequestStatus(item.id, 'FULFILLED')}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 size={13} /> Complete Delivery
                    </button>
                  )}
                  {item.status === 'FULFILLED' && (
                    <div className="flex-1 text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                      ✓ Delivery Verified
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedReq(item)}
                  className="w-full py-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Clock size={12} /> View Audit Timeline ({item.timeline?.length || 1} steps)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Professional Audit Timeline Drawer */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{selectedReq.id}</span>
                <h3 className="text-base font-black text-slate-900">{selectedReq.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedReq(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Visual Timeline Stepper */}
            <div className="space-y-6 pl-2 pr-1">
              {selectedReq.timeline?.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  {idx !== selectedReq.timeline.length - 1 && (
                    <div className="absolute left-3.5 top-7 w-0.5 h-full bg-slate-200"></div>
                  )}
                  <div className="w-7 h-7 rounded-full bg-[#080d1d] text-white flex items-center justify-center text-xs font-black shrink-0 z-10 shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-black text-slate-900">{step.stage}</h4>
                      <span className="text-[10px] font-semibold text-slate-400">{step.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{step.desc}</p>
                    <div className="mt-2 text-[10px] font-mono text-blue-600 font-medium">
                      Recorded by: {step.agent}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedReq(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Log Community Aid Request</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Request Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20 Family Dry Ration Kits"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kannan"
                    value={form.recipientName}
                    onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20 Kits"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Location / Ward</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gandhi Nagar Ward 4, Cuddalore"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Emergency Notes</label>
                <textarea
                  rows="2"
                  placeholder="Details on affected families, urgent dietary needs..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#080d1d] text-white font-bold rounded-xl cursor-pointer"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}