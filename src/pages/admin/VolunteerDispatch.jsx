import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useData } from '../../context/DataContext';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Truck, 
  AlertCircle 
} from 'lucide-react';

export default function VolunteerDispatch() {
  const { requests = [], updateRequestStatus, refreshAllData } = useData();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getMembers();
      if (Array.isArray(res)) {
        setVolunteers(res.filter(m => m.role === 'VOLUNTEER'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approvedVolunteers = volunteers.filter(v => v.isApproved);
  const pendingRequests = requests.filter(r => r.status === 'PENDING');

  const handleAssign = async (requestId, volunteerName) => {
    if (!volunteerName) return;
    await updateRequestStatus(requestId, 'IN_PROGRESS', volunteerName);
    await refreshAllData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Volunteer Dispatch Control</h1>
        <p className="text-xs text-slate-500 mt-1">Assign unallocated aid requests directly to verified on-ground personnel</p>
      </div>

      {/* Available Authorized Volunteers */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Active Approved Field Personnel ({approvedVolunteers.length})</span>
        </h2>

        {loading ? (
          <p className="text-xs text-slate-400 py-4 text-center">Checking database roster...</p>
        ) : approvedVolunteers.length === 0 ? (
          <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
            No approved volunteers yet. Please approve registered applicants in the <strong>Community Members</strong> tab first.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {approvedVolunteers.map((vol) => (
              <div key={vol._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{vol.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[9px] rounded-full border border-emerald-200">
                    AUTHORIZED
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <MapPin size={12} className="text-slate-400 shrink-0" /> {vol.address || 'Field Base'}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400 shrink-0" /> {vol.phone || 'No direct phone'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Direct Assignment Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Truck size={16} className="text-blue-600" />
          <span>Unassigned Help Tickets Needing Dispatch ({pendingRequests.length})</span>
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
            All tickets are assigned or fulfilled. No pending dispatches at this moment.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingRequests.map((req) => (
              <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{req.title}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Beneficiary: <strong>{req.recipientName}</strong> • {req.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    id={`select-${req.id}`}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Select Volunteer</option>
                    {approvedVolunteers.map(v => (
                      <option key={v._id} value={v.name}>{v.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      const select = document.getElementById(`select-${req.id}`);
                      handleAssign(req.id, select.value);
                    }}
                    className="px-4 py-2 bg-[#080d1d] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs"
                  >
                    Dispatch Unit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}