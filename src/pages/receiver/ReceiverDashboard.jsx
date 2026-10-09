import React, { useState } from 'react';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  PackageCheck, 
  Truck, 
  MapPin, 
  Calendar, 
  AlertTriangle,
  FileCheck2
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import CreateRequestModal from './CreateRequestModal';

const initialReceiverRequests = [
  {
    id: 'REQ-101',
    category: 'Medicine',
    title: 'Insulin and Chronic Medication Support',
    quantity: '2 Months Supply',
    urgency: 'Critical',
    location: 'Gandhi Nagar, Ward 4',
    status: 'IN_TRANSIT',
    assignedVolunteer: 'Kavitha Raman (Field Volunteer)',
    createdAt: 'Oct 08, 2026',
    requiredDate: '2026-10-15'
  },
  {
    id: 'REQ-105',
    category: 'Food',
    title: 'Dry Ration and Cooking Oil Package',
    quantity: '2 Family Grocery Packs',
    urgency: 'High',
    location: 'Gandhi Nagar, Ward 4',
    status: 'APPROVED',
    assignedVolunteer: 'Awaiting Donor Matching',
    createdAt: 'Oct 09, 2026',
    requiredDate: '2026-10-12'
  },
  {
    id: 'REQ-106',
    category: 'Clothes',
    title: 'School Uniforms and Shoes for 2 Children',
    quantity: '2 Sets',
    urgency: 'Normal',
    location: 'Gandhi Nagar, Ward 4',
    status: 'PENDING',
    assignedVolunteer: 'Under Admin Review',
    createdAt: 'Today, 02:15 PM',
    requiredDate: '2026-10-20'
  }
];

export default function ReceiverDashboard({ currentUser }) {
  const [requests, setRequests] = useState(initialReceiverRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRequest = (newReq) => {
    setRequests([newReq, ...requests]);
  };

  const handleConfirmReceived = (id) => {
    setRequests(
      requests.map((r) => 
        r.id === id ? { ...r, status: 'COMPLETED' } : r
      )
    );
    alert(`Success! Delivery confirmed for ${id}. A digital receipt is now generated.`);
  };

  return (
    <div className="space-y-6">
      {/* 4 Metrics for Receiver */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Requests</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{requests.length}</h3>
            <span className="text-[11px] text-slate-500 font-medium">Logged in portal</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <PackageCheck size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Review</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {requests.filter(r => r.status === 'PENDING').length}
            </h3>
            <span className="text-[11px] text-amber-600 font-medium">Awaiting verification</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active & Transit</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {requests.filter(r => r.status === 'APPROVED' || r.status === 'IN_TRANSIT').length}
            </h3>
            <span className="text-[11px] text-sky-600 font-medium">Being delivered</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Truck size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Received Aid</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {requests.filter(r => r.status === 'COMPLETED').length}
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium">Fulfilled & Verified</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={22} />
          </div>
        </div>
      </div>

      {/* Main Request Manager Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Aid Requests</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Track real-time status of your food, medicine, and support deliveries
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Request Support</span>
          </button>
        </div>

        {/* Requests Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold bg-slate-50/50">
                <th className="px-5 py-3">REQ ID</th>
                <th className="px-5 py-3">ITEM DESCRIPTION</th>
                <th className="px-5 py-3">CATEGORY</th>
                <th className="px-5 py-3">URGENCY</th>
                <th className="px-5 py-3">LIVE STATUS</th>
                <th className="px-5 py-3">DISPATCH / VOLUNTEER</th>
                <th className="px-5 py-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{req.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900">{req.title}</p>
                    <p className="text-[11px] text-slate-500">Quantity: {req.quantity}</p>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-700">{req.category}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge type="urgency" value={req.urgency} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge type="status" value={req.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">
                    {req.assignedVolunteer}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {req.status === 'IN_TRANSIT' ? (
                      <button
                        onClick={() => handleConfirmReceived(req.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <FileCheck2 size={13} />
                        <span>Confirm Received</span>
                      </button>
                    ) : req.status === 'COMPLETED' ? (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        Received & Confirmed
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        In Pipeline
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Injection */}
      <CreateRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitRequest={handleAddRequest}
      />
    </div>
  );
}