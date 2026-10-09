import React from 'react';

export default function StatusBadge({ type, value }) {
  if (type === 'urgency') {
    const urgencyStyles = {
      Critical: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
      High: 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
      Normal: 'bg-slate-50 text-slate-700 border-slate-200',
    };
    return (
      <span className={`px-2.5 py-0.5 text-xs rounded-full border ${urgencyStyles[value] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
        {value}
      </span>
    );
  }

  if (type === 'role') {
    const roleStyles = {
      ADMIN: 'bg-blue-50 text-blue-700 border-blue-200',
      DONOR: 'bg-sky-50 text-sky-700 border-sky-200',
      VOLUNTEER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      RECEIVER: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return (
      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${roleStyles[value] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
        {value}
      </span>
    );
  }

  if (type === 'status') {
    const statusStyles = {
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
      UNDER_REVIEW: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
      MATCHED: 'bg-sky-50 text-sky-700 border-sky-200',
      IN_TRANSIT: 'bg-blue-50 text-blue-700 border-blue-200',
      DELIVERED: 'bg-teal-50 text-teal-700 border-teal-200',
      COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
      CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return (
      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusStyles[value] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
        {value}
      </span>
    );
  }

  return (
    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
      {value}
    </span>
  );
}