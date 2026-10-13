import React from 'react';
import { Receipt, CheckCircle, Download, ExternalLink } from 'lucide-react';

export default function DigitalReceipts() {
  const receipts = [
    { id: 'RCP-88910', date: '12 Oct 2026', to: 'North District Relief Center', items: 'Water Purification Tablets x200', verified: true },
    { id: 'RCP-88911', date: '13 Oct 2026', to: 'Community Care Shelter B', items: 'Emergency Blankets x80', verified: true }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900">Digital Handover Receipts</h2>
        <p className="text-xs text-slate-400">Cryptographically signed delivery vouchers and handover slips</p>
      </div>

      <div className="space-y-3">
        {receipts.map((r) => (
          <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm font-mono">{r.id}</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">Signed</span>
                </div>
                <p className="text-xs text-slate-700 font-medium mt-0.5">{r.to}</p>
                <p className="text-xs text-slate-400">{r.items}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 text-xs">
              <span className="text-slate-400">{r.date}</span>
              <button className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold inline-flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}