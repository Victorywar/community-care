import React from 'react';
import { Heart, Package, Check, Calendar } from 'lucide-react';

export default function DonationManagement() {
  const donations = [
    { id: 'DON-1021', donor: 'Aravind Kumar', items: 'Rice & Dry Rations (50kg)', date: 'Today, 2:30 PM', status: 'In Warehouse' },
    { id: 'DON-1022', donor: 'Priya Sundar', items: 'Pediatric Medical Kits', date: 'Yesterday', status: 'Allocated' },
    { id: 'DON-1023', donor: 'Rotary Club Chennai', items: 'Sanitation & Hygiene Packs', date: '11 Oct', status: 'Dispatched' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900">Donation Ledger</h2>
        <p className="text-xs text-slate-400">Inbound contributions and warehouse staging registry</p>
      </div>

      <div className="space-y-3">
        {donations.map((d) => (
          <div key={d.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{d.items}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">({d.id})</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Contributor: <span className="font-medium text-slate-700">{d.donor}</span></p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 text-xs">
              <span className="text-slate-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{d.date}</span>
              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">{d.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}