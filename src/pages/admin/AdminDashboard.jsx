import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  HeartHandshake, 
  Users, 
  Clock, 
  Truck,
  RotateCcw
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { useData } from '../../context/DataContext';

export default function AdminDashboard() {
  const { requests, stats, approveRequest, rejectRequest, addRequest, clearAllData } = useData();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredRequests = requests.filter((req) => {
    const matchesTab = activeTab === 'ALL' || req.status?.toUpperCase() === activeTab;
    const matchesCat = selectedCategory === 'ALL' || req.category === selectedCategory;
    const recipient = req.recipientName || req.receiverName || '';
    const matchesSearch = 
      (req.title && req.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.id && req.id.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: PENDING REQUESTS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">PENDING REQUESTS</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.pendingRequests}</h2>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Needs Verification</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock size={24} />
          </div>
        </div>

        {/* Card 2: ACTIVE DONATIONS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">ACTIVE DONATIONS</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.activeDonations}</h2>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">In Matching & Transit</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <HeartHandshake size={24} />
          </div>
        </div>

        {/* Card 3: PEOPLE HELPED */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">PEOPLE HELPED</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.peopleHelped}</h2>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Verified & Approved</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <Users size={24} />
          </div>
        </div>

        {/* Card 4: ACTIVE VOLUNTEERS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">ACTIVE VOLUNTEERS</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.activeVolunteers}</h2>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Available on duty</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <Truck size={24} />
          </div>
        </div>
      </div>

      {/* Incoming Help Requests Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Incoming Help Requests</h3>
            <p className="text-xs text-slate-400">Verify medical, ration, and essential requests before donors can fulfill them</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={clearAllData}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title="Reset all database records to 0"
            >
              <RotateCcw size={14} /> Clear All Data
            </button>
            <button
              onClick={() => {
                addRequest({
                  title: 'Emergency Ration Kits (Rice & Pulses)',
                  recipientName: 'Kavitha R',
                  category: 'Food',
                  location: 'Gandhi Nagar, Ward 4',
                  quantity: '10 Kits'
                });
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={16} /> Log Direct Request
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-50/60 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by recipient, title, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Requests Table / List */}
        <div className="divide-y divide-slate-100">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Clock size={36} className="mx-auto text-slate-300 mb-2" />
              <h4 className="text-sm font-semibold text-slate-700">No requests in database</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Everything is clear. Click <strong>"Log Direct Request"</strong> above to test an incoming request.
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const recipient = req.recipientName || req.receiverName || 'Anonymous';
              const isPending = req.status?.toUpperCase() === 'PENDING';

              return (
                <div key={req.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{req.id}</span>
                      <StatusBadge status={req.status?.toUpperCase()} />
                      <span className="text-[11px] text-slate-400">• {req.category}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800">{req.title}</h4>
                    <p className="text-xs text-slate-500">
                      {recipient} • <span className="text-slate-400">{req.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => approveRequest(req.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          onClick={() => rejectRequest(req.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium px-2 py-1">
                        {req.status?.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}