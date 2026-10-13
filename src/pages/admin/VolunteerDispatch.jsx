import React from 'react';
import { Truck, MapPin, Phone, Shield } from 'lucide-react';

export default function VolunteerDispatch() {
  const volunteers = [
    { id: 1, name: 'Karthik Raja', vehicle: 'Van (TN 09 BX 4412)', route: 'Zone 4 -> North Camp', phone: '+91 98401 23456', status: 'Active Transit' },
    { id: 2, name: 'Sanjay V', vehicle: 'Motorbike', route: 'Urban Sector Hospital', phone: '+91 98402 78901', status: 'Standby' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900">Volunteer Field Fleet</h2>
        <p className="text-xs text-slate-400">Live operational field dispatches and driver contact relay</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {volunteers.map((v) => (
          <div key={v.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{v.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Shield className="w-3.5 h-3.5 text-blue-500" /> {v.vehicle}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${v.status === 'Active Transit' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-100 text-slate-600'}`}>
                {v.status}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{v.route}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">{v.phone}</span>
              <button className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800">Dispatch Ping</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}