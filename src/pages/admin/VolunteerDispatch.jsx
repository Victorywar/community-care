import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Truck, MapPin, User, CheckCircle2, RefreshCw } from 'lucide-react';

export default function VolunteerDispatch() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      // Show actual requests in transit or assigned to field volunteers
      setTasks(Array.isArray(data) ? data.filter(r => r.status === 'FUNDED' || r.status === 'DISPATCHED' || r.status === 'COMPLETED') : []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Volunteer Field Fleet & Dispatches</h2>
          <p className="text-xs text-slate-400">Live MongoDB transit manifests assigned to field personnel</p>
        </div>
        <button onClick={fetchTasks} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="p-10 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
          No dispatches active in the field right now. When Donors fulfill verified requests, they will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {tasks.map((t) => (
            <div key={t._id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm text-slate-900">{t.itemName} ({t.quantity} units)</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                  {t.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {t.location}</div>
                <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> Receiver: <strong className="text-slate-700">{t.recipientName}</strong></div>
                {t.donorName && <div className="text-[11px] text-purple-600">Funded by: {t.donorName}</div>}
                {t.volunteerName && <div className="text-[11px] text-emerald-600 font-semibold">Delivered by: {t.volunteerName}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}