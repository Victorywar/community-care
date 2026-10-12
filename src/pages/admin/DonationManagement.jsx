import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  HeartHandshake, 
  Search, 
  Plus, 
  DollarSign, 
  Package, 
  Clock, 
  CheckCircle2, 
  Tag,
  User,
  ExternalLink
} from 'lucide-react';

export default function DonationManagement() {
  const { donations = [], addDonation } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New donation form state
  const [formData, setFormData] = useState({
    donorName: '',
    category: 'Food Supplies',
    type: 'IN_KIND', // or FINANCIAL
    amountOrQty: '',
    status: 'RECEIVED',
    notes: '',
  });

  const handleCreateDonation = (e) => {
    e.preventDefault();
    if (!formData.donorName || !formData.amountOrQty) return;

    if (addDonation) {
      addDonation({
        id: 'DON-' + Date.now().toString().slice(-4),
        donorName: formData.donorName,
        category: formData.category,
        type: formData.type,
        amountOrQty: formData.amountOrQty,
        status: formData.status,
        date: new Date().toISOString().split('T')[0],
      });
    }

    setFormData({
      donorName: '',
      category: 'Food Supplies',
      type: 'IN_KIND',
      amountOrQty: '',
      status: 'RECEIVED',
      notes: '',
    });
    setIsModalOpen(false);
  };

  const filteredDonations = donations.filter((don) => {
    const matchesSearch = 
      (don.donorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (don.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (don.amountOrQty || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || don.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Donation Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track incoming relief goods, medical inventory, and community financial aids
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Log New Donation</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Entries</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{donations.length}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">In-Kind Items</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {donations.filter(d => d.type === 'IN_KIND').length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Financial Grants</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {donations.filter(d => d.type === 'FINANCIAL').length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by donor, category, or quantity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['ALL', 'IN_KIND', 'FINANCIAL'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTypeFilter(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                typeFilter === tab
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'IN_KIND' ? 'In-Kind' : tab === 'FINANCIAL' ? 'Financial' : 'All Types'}
            </button>
          ))}
        </div>
      </div>

      {/* Donations Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredDonations.length === 0 ? (
          <div className="p-12 text-center">
            <HeartHandshake size={36} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No donations recorded yet</h4>
            <p className="text-xs text-slate-500 mt-1">Click "Log New Donation" above to record aid items.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Donor Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Amount / Qty</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px]">
                          {d.donorName?.charAt(0) || 'D'}
                        </div>
                        <span>{d.donorName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        d.type === 'FINANCIAL'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {d.type === 'FINANCIAL' ? 'Financial' : 'In-Kind'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{d.category}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{d.amountOrQty}</td>
                    <td className="py-3.5 px-4 text-slate-400">{d.date || 'Recent'}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                        <CheckCircle2 size={12} />
                        {d.status || 'Received'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Log New Donation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Record New Donation</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDonation} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Donor Name / Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotary Club Chennai / Anand K"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Donation Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="IN_KIND">In-Kind Goods</option>
                    <option value="FINANCIAL">Financial Grant</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Food Supplies">Food Supplies</option>
                    <option value="Medical & First Aid">Medical & First Aid</option>
                    <option value="Blankets & Clothing">Blankets & Clothing</option>
                    <option value="Emergency Funds">Emergency Funds</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantity or Amount</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 Ration Bags or ₹25,000"
                  value={formData.amountOrQty}
                  onChange={(e) => setFormData({ ...formData, amountOrQty: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}