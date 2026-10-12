import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  Clock, 
  X,
  Printer
} from 'lucide-react';

export default function DigitalReceipts() {
  const { receipts = [] } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const filteredReceipts = receipts.filter(
    (r) =>
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.beneficiary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Instant Certificate Printing & PDF Saving Function
  const handlePrintCertificate = (receipt) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Relief Verification Certificate - ${receipt.id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #0f172a; background: #fff; }
            .cert-box { border: 4px double #0f172a; padding: 36px; border-radius: 12px; max-width: 650px; margin: 0 auto; }
            h1 { font-size: 24px; text-transform: uppercase; margin-bottom: 4px; }
            .badge { display: inline-block; background: #ecfdf5; color: #047857; font-weight: bold; padding: 4px 12px; border-radius: 99px; font-size: 11px; margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; border-bottom: 1px dotted #cbd5e1; padding-bottom: 6px; }
            .label { font-weight: bold; color: #64748b; }
            .hash { font-family: monospace; font-size: 11px; word-break: break-all; background: #f8fafc; padding: 8px; border-radius: 6px; margin-top: 15px; }
            .timeline { margin-top: 20px; font-size: 12px; }
            .timeline-item { margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <h1>Community Care Dispatch Proof</h1>
            <div class="badge">VERIFIED IMMUTABLE RECORD</div>
            <div class="row"><span class="label">Receipt Number:</span><span>${receipt.id}</span></div>
            <div class="row"><span class="label">Date Executed:</span><span>${receipt.date}</span></div>
            <div class="row"><span class="label">Donor / Provider:</span><span>${receipt.donor}</span></div>
            <div class="row"><span class="label">Beneficiary / Target:</span><span>${receipt.beneficiary}</span></div>
            <div class="row"><span class="label">Supplies Distributed:</span><span>${receipt.item}</span></div>
            <div class="hash"><strong>Audit Cryptographic Hash:</strong><br/>${receipt.hash}</div>
            <div class="timeline">
              <strong>Audit Ledger Milestones:</strong>
              ${(receipt.timeline || []).map(t => `<div class="timeline-item">• ${t.time} - <strong>${t.stage}</strong>:${t.desc}</div>`).join('')}
            </div>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Digital Receipts & Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time immutable dispatch proofs and transparent audit trails for all aid movements
          </p>
        </div>
        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold self-start sm:self-auto">
          Total Receipts: {receipts.length}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by receipt ID, donor, or beneficiary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Receipts List */}
      {filteredReceipts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
          <FileText size={36} className="mx-auto text-slate-300 mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No receipts logged yet</h4>
          <p className="text-xs text-slate-500 mt-1">
            Receipts are automatically generated when a help request is marked fulfilled or a donation is logged.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReceipts.map((rcp) => (
            <div
              key={rcp.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-slate-900">{rcp.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck size={11} /> {rcp.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">{rcp.item}</p>
                <p className="text-xs text-slate-500">
                  Provided by <strong className="text-slate-700">{rcp.donor}</strong> • Dispatched to{' '}
                  <strong className="text-slate-700">{rcp.beneficiary}</strong>
                </p>
                <div className="font-mono text-[10px] text-slate-400 break-all pt-1">
                  Hash: {rcp.hash}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedReceipt(rcp)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Clock size={13} /> Timeline
                </button>
                <button
                  onClick={() => handlePrintCertificate(rcp)}
                  className="px-3.5 py-2 bg-[#080d1d] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Download size={13} /> Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline Inspector Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{selectedReceipt.id}</span>
                <h3 className="text-sm font-black text-slate-900">Receipt Verification Trail</h3>
              </div>
              <button 
                onClick={() => setSelectedReceipt(null)} 
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {(selectedReceipt.timeline || []).map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{step.stage}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{step.time}</span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}