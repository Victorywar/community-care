import React from 'react';
import { CheckCircle2, Clock, CircleDot, User, MapPin, Image as ImageIcon } from 'lucide-react';

export default function OrderTimeline({ request }) {
  const stages = [
    { key: 'REQUESTED', label: '1. Aid Requested', color: 'blue', desc: 'Recipient Requisition' },
    { key: 'VERIFIED', label: '2. Admin Verified', color: 'amber', desc: 'Audit & Approval' },
    { key: 'FUNDED', label: '3. Donor Funded', color: 'purple', desc: 'Supplies Secured' },
    { key: 'DISPATCHED', label: '4. Volunteer Transit', color: 'indigo', desc: 'Field Fleet Transit' },
    { key: 'COMPLETED', label: '5. Delivered & Verified', color: 'emerald', desc: 'Handover & Review' },
  ];

  const getStatusIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'VERIFIED': return 1;
      case 'FUNDED': return 2;
      case 'DISPATCHED': return 3;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex(request.status);

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Requisition Timeline</span>
        <span className="text-[11px] font-semibold text-slate-500">ID: #{request._id?.slice(-5)}</span>
      </div>

      {/* Progress Line */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {stages.map((st, i) => {
          const isDone = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const timelineEntry = request.timeline?.find(t => t.stage === st.key);

          return (
            <div key={st.key} className="relative group">
              {/* Stage Dot / Icon */}
              <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                isDone 
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' 
                  : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}>
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CircleDot className="w-3 h-3" />}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-bold ${isCurrent ? 'text-blue-600' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                    {st.label}
                  </p>
                  {timelineEntry && (
                    <span className="text-[10px] text-slate-400">
                      {new Date(timelineEntry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {timelineEntry ? timelineEntry.description : st.desc}
                </p>

                {/* Evidence Photo if present at this stage */}
                {st.key === 'REQUESTED' && request.recipientPhoto && (
                  <div className="mt-2">
                    <img src={request.recipientPhoto} alt="Requested Item" className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                  </div>
                )}
                {st.key === 'FUNDED' && request.donationPhoto && (
                  <div className="mt-2">
                    <span className="text-[10px] font-semibold text-purple-700 block mb-1">Donor Contribution Photo:</span>
                    <img src={request.donationPhoto} alt="Donation Proof" className="w-20 h-20 object-cover rounded-xl border border-purple-200" />
                  </div>
                )}
                {st.key === 'DISPATCHED' && request.dispatchPhoto && (
                  <div className="mt-2">
                    <span className="text-[10px] font-semibold text-indigo-700 block mb-1">Volunteer Transit Proof:</span>
                    <img src={request.dispatchPhoto} alt="Transit Proof" className="w-20 h-20 object-cover rounded-xl border border-indigo-200" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}