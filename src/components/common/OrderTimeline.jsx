import React from 'react';
import { CheckCircle2, CircleDot, Clock } from 'lucide-react';

export default function OrderTimeline({ request }) {
  const stages = [
    { key: 'REQUESTED', label: '1. Aid Requested', desc: 'Recipient Requisition Created' },
    { key: 'ACCEPTED', label: '2. Admin Accepted & Approved', desc: 'Audited & Published to Donors' },
    { key: 'FUNDED', label: '3. Donor Accepted & Supplied', desc: 'Supplies Secured & Ready for Dispatch' },
    { key: 'DISPATCHED', label: '4. Volunteer Accepted Transit', desc: 'Field Fleet In Transit' },
    { key: 'COMPLETED', label: '5. Handover Verified & Reviewed', desc: 'Recipient Sign-off Completed' },
  ];

  const getStatusIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'ACCEPTED':
      case 'VERIFIED': return 1;
      case 'FUNDED': return 2;
      case 'DISPATCHED': return 3;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex(request.status);

  return (
    <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/90 space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
        <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Workflow Progress Pipeline</span>
        <span className="font-mono text-slate-400 text-[10px]">#{request._id?.slice(-5)}</span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {stages.map((st, i) => {
          const isDone = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const matchKey = st.key === 'ACCEPTED' ? (request.status === 'VERIFIED' ? 'VERIFIED' : 'ACCEPTED') : st.key;
          const entry = request.timeline?.find(t => t.stage === matchKey || (st.key === 'ACCEPTED' && t.stage === 'VERIFIED'));

          return (
            <div key={st.key} className="relative group">
              <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                isDone 
                  ? 'bg-black text-white ring-4 ring-slate-200 shadow-xs' 
                  : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}>
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <CircleDot className="w-3 h-3" />}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className={`font-bold ${isCurrent ? 'text-black' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                    {st.label}
                  </p>
                  {entry && (
                    <span className="text-[10px] text-slate-400">
                      {new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {entry ? entry.description : st.desc}
                </p>

                {st.key === 'REQUESTED' && request.recipientPhoto && (
                  <img src={request.recipientPhoto} alt="Requested" className="w-16 h-16 object-cover rounded-xl mt-2 border border-slate-200" />
                )}
                {st.key === 'FUNDED' && request.donationPhoto && (
                  <img src={request.donationPhoto} alt="Donation" className="w-16 h-16 object-cover rounded-xl mt-2 border border-slate-200" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}