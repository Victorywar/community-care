import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Truck,
  Plus
} from 'lucide-react';

export default function HelpRequests() {
  const { requests = [], updateRequestStatus } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter requests by search query and active tab
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      (req.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.recipientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.category || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' || (req.status || 'PENDING').toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getUrgencyBadge = (urgency) => {
    switch ((urgency || '').toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'FULFILLED':
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'IN_PROGRESS':
      case 'DISPATCHED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Help Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, verify, and assign community emergency relief tickets
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-xs">
            Total: {requests.length}
          </span>
          <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl font-bold text-amber-700 shadow-xs">
            Pending: {requests.filter(r => (r.status || 'PENDING').toUpperCase() === 'PENDING').length}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by recipient, title, location, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['ALL', 'PENDING', 'IN_PROGRESS', 'FULFILLED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-[#0f172a] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Grid / List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <AlertCircle size={36} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No requests found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No relief requests match the active filter criteria. Try changing your search query or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${getUrgencyBadge(item.urgency)}`}>
                    {item.urgency || 'Normal'}
                  </span>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${getStatusBadge(item.status)}`}>
                    {(item.status || 'PENDING').replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {item.description || 'Emergency aid kit required for distribution.'}
                </p>
              </div>

              {/* Details List */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <User size={13} className="text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">{item.recipientName || 'Community Member'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{item.location || 'Local Ward'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 border-t border-slate-200/60 mt-1">
                  <span>Quantity: <strong className="text-slate-800">{item.quantity || '1 Kit'}</strong></span>
                  <span>{item.category || 'General'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                {(item.status || 'PENDING').toUpperCase() === 'PENDING' && (
                  <button
                    onClick={() => updateRequestStatus && updateRequestStatus(item.id, 'IN_PROGRESS')}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Truck size={13} />
                    Dispatch Aid
                  </button>
                )}

                {(item.status || '').toUpperCase() === 'IN_PROGRESS' && (
                  <button
                    onClick={() => updateRequestStatus && updateRequestStatus(item.id, 'FULFILLED')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 size={13} />
                    Mark Fulfilled
                  </button>
                )}

                {(item.status || '').toUpperCase() === 'FULFILLED' && (
                  <div className="w-full text-center py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl">
                    ✓ Request Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}