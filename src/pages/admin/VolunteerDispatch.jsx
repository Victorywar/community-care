import React, { useState } from 'react';
import { Truck, MapPin, Phone, UserCheck, CheckCircle2, Clock, Navigation } from 'lucide-react';

export default function VolunteerDispatch() {
  const [volunteers, setVolunteers] = useState([
    { id: 'VOL-01', name: 'Kavitha Raman', phone: '+91 98401 23456', zone: 'Ward 4 - Gandhi Nagar', status: 'ON_ROUTE', task: 'Delivering 10 Ration Kits', eta: '15 mins' },
    { id: 'VOL-02', name: 'Suresh Kumar', phone: '+91 98402 34567', zone: 'Ward 7 - Nehru Street', status: 'AVAILABLE', task: 'Awaiting assignment', eta: 'Idle' },
    { id: 'VOL-03', name: 'Arun Prakash', phone: '+91 98403 45678', zone: 'Ward 12 - Lake Area', status: 'DELIVERED', task: 'Completed First Aid Kits batch', eta: 'Done' }
  ]);

  const toggleStatus = (id) => {
    setVolunteers(prev => prev.map(vol => {
      if (vol.id === id) {
        const nextStatus = vol.status === 'AVAILABLE' ? 'ON_ROUTE' : vol.status === 'ON_ROUTE' ? 'DELIVERED' : 'AVAILABLE';
        return { ...vol, status: nextStatus };
      }
      return vol;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Volunteer Dispatch</h1>
          <p className="text-xs text-slate-500 mt-1">Live assignment, on-ground transport monitoring, and delivery fulfillment</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold">
            Active in Field: {volunteers.filter(v => v.status === 'ON_ROUTE').length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {volunteers.map(vol => (
          <div key={vol.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{vol.id}</span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                vol.status === 'ON_ROUTE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                vol.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {vol.status.replace('_', ' ')}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900">{vol.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin size={13} className="text-slate-400" /> {vol.zone}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <Phone size={13} className="text-slate-400" /> {vol.phone}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Task</span>
              <p className="font-semibold text-slate-800 mt-0.5">{vol.task}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><Clock size={12}/> ETA</span>
                <span className="font-bold text-slate-700">{vol.eta}</span>
              </div>
            </div>

            <button
              onClick={() => toggleStatus(vol.id)}
              className="w-full py-2.5 bg-[#080d1d] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Update Stage
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}