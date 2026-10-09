import React, { useState } from 'react';
import { FileCheck, Search, ShieldCheck, Printer, CheckCircle2, X } from 'lucide-react';

const receiptRecords = [
  {
    id: 'REC-901',
    hash: '0x8f2a...c391',
    donationId: 'DON-398',
    item: 'Fresh Cooked Meals (100 Boxes)',
    donor: 'Anand Kumar',
    recipient: 'Arulmozhi Varman',
    volunteer: 'Senthil Nathan',
    date: 'Oct 04, 2026',
    status: 'VERIFIED'
  },
  {
    id: 'REC-892',
    hash: '0x3d4b...9e10',
    donationId: 'DON-365',
    item: 'Pediatric Antibiotics (20 Units)',
    donor: 'Care Pharmacy Network',
    recipient: 'Priya Sundaram',
    volunteer: 'Kavitha Raman',
    date: 'Oct 01, 2026',
    status: 'VERIFIED'
  },
  {
    id: 'REC-884',
    hash: '0x5e19...aa72',
    donationId: 'DON-340',
    item: 'Dry Ration Grocery Kits (15 Kits)',
    donor: 'Meenakshi Enterprises',
    recipient: 'Selvam Murugan',
    volunteer: 'Kavitha Raman',
    date: 'Sep 28, 2026',
    status: 'VERIFIED'
  }
];

export default function DigitalReceiptsLedger() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeReceipt, setActiveReceipt] = useState(null);

  const filtered = receiptRecords.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header Controls */}
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Verifiable Digital Receipts Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">Auditable records of completed deliveries verified by donors, volunteers, and beneficiaries</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by receipt ID, donor, recipient, item..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold bg-slate-50/50">
                <th className="px-5 py-3">RECEIPT REF</th>
                <th className="px-5 py-3">PROOF HASH</th>
                <th className="px-5 py-3">DONATED ITEM</th>
                <th className="px-5 py-3">DONOR</th>
                <th className="px-5 py-3">RECIPIENT</th>
                <th className="px-5 py-3">VOLUNTEER</th>
                <th className="px-5 py-3">TIMESTAMP</th>
                <th className="px-5 py-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{r.id}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-blue-600">{r.hash}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-900">{r.item}</td>
                  <td className="px-5 py-3.5">{r.donor}</td>
                  <td className="px-5 py-3.5">{r.recipient}</td>
                  <td className="px-5 py-3.5 text-slate-500">{r.volunteer}</td>
                  <td className="px-5 py-3.5 text-slate-500">{r.date}</td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => setActiveReceipt(r)}
                      className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-blue-600 text-[11px] cursor-pointer"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Single Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">VERIFIED DIGITAL RECEIPT</h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{activeReceipt.hash}</p>
            </div>
            <div className="py-4 space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between"><span className="text-slate-400">Receipt Ref:</span> <span className="font-bold text-slate-900">{activeReceipt.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Donation ID:</span> <span className="font-semibold text-slate-800">{activeReceipt.donationId}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Donor:</span> <span className="font-semibold text-slate-800">{activeReceipt.donor}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Recipient:</span> <span className="font-semibold text-slate-800">{activeReceipt.recipient}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Item:</span> <span className="font-semibold text-slate-800">{activeReceipt.item}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Volunteer:</span> <span className="font-semibold text-slate-800">{activeReceipt.volunteer}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Date:</span> <span className="font-semibold text-slate-800">{activeReceipt.date}</span></div>
            </div>
            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-[#0b1329] hover:bg-[#152244] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Certificate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}