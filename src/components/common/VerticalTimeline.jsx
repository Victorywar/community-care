import React from 'react';
import { Check } from 'lucide-react';

export default function VerticalTimeline({ status = 'LOGGED', createdAt, assignedVolunteer, donationId }) {
  const formatTime = (dateStr, offsetMinutes = 0) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    d.setMinutes(d.getMinutes() + offsetMinutes);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const steps = [
    {
      key: 'LOGGED',
      title: 'Order Placed',
      desc: `Your order #${donationId || '4913'} was placed for delivery.`,
      time: formatTime(createdAt, 0),
    },
    {
      key: 'ASSIGNED',
      title: 'Pending',
      desc: assignedVolunteer && assignedVolunteer !== 'Unassigned'
        ? `Assigned to ${assignedVolunteer}. Awaiting field pickup.`
        : 'Your order is pending for confirmation. Assigned to field unit.',
      time: formatTime(createdAt, 15),
    },
    {
      key: 'IN_TRANSIT',
      title: 'Confirmed',
      desc: 'Your order is confirmed. Will deliver soon.',
      time: formatTime(createdAt, 20),
    },
    {
      key: 'PROCESSING',
      title: 'Processing',
      desc: 'Package verified and moving through field transit.',
      time: formatTime(createdAt, 35),
    },
    {
      key: 'FULFILLED',
      title: 'Delivered',
      desc: 'Your order has been delivered successfully to recipients.',
      time: formatTime(createdAt, 50),
    },
  ];

  const statusOrder = ['LOGGED', 'ASSIGNED', 'IN_TRANSIT', 'PROCESSING', 'FULFILLED'];
  const currentIndex = statusOrder.indexOf(status) !== -1 ? statusOrder.indexOf(status) : 0;

  return (
    <div className="py-3 px-2 max-w-sm">
      {steps.map((step, index) => {
        const isDone = index <= currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.key} className="flex items-start gap-4 relative">
            <div className="w-16 text-right pt-1 shrink-0">
              <span className={`text-[11px] font-bold ${isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.time}
              </span>
            </div>

            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-[#2ecc71] text-white shadow-xs'
                    : 'bg-slate-200 text-transparent'
                }`}
              >
                {isDone ? <Check size={15} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
              </div>

              {!isLast && (
                <div
                  className={`w-0.5 h-12 my-1 transition-all ${
                    index < currentIndex ? 'bg-[#2ecc71]' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>

            <div className="flex-1 pb-5 pt-0.5">
              <h4
                className={`text-xs font-black tracking-tight ${
                  isDone ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {step.title}
              </h4>
              <p
                className={`text-[11px] mt-0.5 leading-relaxed ${
                  isDone ? 'text-slate-500' : 'text-slate-300'
                }`}
              >
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
