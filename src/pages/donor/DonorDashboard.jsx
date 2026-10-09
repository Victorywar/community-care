import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Truck, 
  Users, 
  FileText, 
  Plus, 
  Filter, 
  Search, 
  MapPin, 
  Calendar,
  ShieldCheck,
  CheckCircle,
  Eye,
  Printer
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import DonateModal from './DonateModal';

// Verified Requests open for donors to fulfill
const verifiedRequestsPool = [
  {
    id: 'REQ-103',
    receiverName: 'Fatima Begum',
    category: 'Clothes',
    title: 'Warm Blankets & Children Clothing',
    quantity: '30 Units',
    urgency: 'Normal',
    location: 'Railway Colony Road',
    status: 'APPROVED',
  },
  {
    id: 'REQ-104',
    receiverName: 'Ravi Teja',
    category: 'Education',
    title: 'Notebooks and School Kits for Primary Students',
    quantity: '50 Kits',
    urgency: 'Normal',
    location: 'East Tambaram',
    status: 'APPROVED',
  },
  {
    id: 'REQ-105',
    receiverName: 'Priya Sundaram',
    category: 'Food',
    title: 'Dry Ration and Cooking Oil Package',
    quantity: '2 Family Grocery Packs',
    urgency: 'High',
    location: 'Gandhi Nagar, Ward 4',
    status: 'APPROVED',
  }
];

// Existing donations made by this donor
const initialDonorContributions = [
  {
    id: 'DON-401',
    matchedReqId: 'REQ-101',
    recipientName: 'Priya Sundaram',
    recipientLocation: 'Gandhi Nagar, Ward 4',
    category: 'Medicine',
    item: 'Insulin and Chronic Medication Support',
    quantity: '2 Months Supply',
    pickupLocation: 'Greenways Road, RA Puram',
    status: 'IN_TRANSIT',
    volunteer: 'Kavitha Raman (Field Volunteer)',
    date: 'Oct 08, 2026',
  },
  {
    id: 'DON-398',
    matchedReqId: 'REQ-088',
    recipientName: 'Arulmozhi Varman',
    recipientLocation: 'Community Shelter 2',
    category: 'Food',
    item: 'Fresh Cooked Meals',
    quantity: '100 Meal Boxes',
    pickupLocation: 'Greenways Road, RA Puram',
    status: 'COMPLETED',
    volunteer: 'Senthil Nathan',
    date: 'Oct 04, 2026',
  }
];

export default function DonorDashboard({ currentUser }) {
  const [contributions, setContributions] = useState(initialDonorContributions);
  const [availableRequests, setAvailableRequests] = useState(verifiedRequestsPool);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [receiptView, setReceiptView] = useState(null);

  const handleOpenDonate = (req = null) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const handleAddDonation = (newDonation) => {
    setContributions([newDonation, ...contributions]);
    if (newDonation.matchedReqId) {
      setAvailableRequests(availableRequests.filter(r => r.id !== newDonation.matchedReqId));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Donations</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{contributions.length}</h3>
            <span className="text-[11px] text-blue-600 font-medium">Recorded contributions</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <HeartHandshake size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Deliveries</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {contributions.filter(c => c.status !== 'COMPLETED').length}
            </h3>
            <span className="text-[11px] text-sky-600 font-medium">In Volunteer Transit</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Truck size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completed Donations</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {contributions.filter(c => c.status === 'COMPLETED').length}
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium">Door-delivered & verified</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Lives Impacted</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">104</h3>
            <span className="text-[11px] text-teal-600 font-medium">Direct beneficiaries</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* Available Verified Requests to Fulfill */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Verified Needs Awaiting Sponsors</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These requests have been vetted by administrators and are ready for item donation
            </p>
          </div>
          <button
            onClick={() => handleOpenDonate(null)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Open Custom Donation</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50/50">
          {availableRequests.map((req) => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {req.id}
                  </span>
                  <StatusBadge type="urgency" value={req.urgency} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{req.title}</h4>
                <p className="text-xs text-slate-500 mt-1">Needed: <span className="font-semibold text-slate-700">{req.quantity}</span></p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{req.location}</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenDonate(req)}
                className="w-full py-2.5 px-3 bg-[#0b1329] hover:bg-[#152244] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HeartHandshake size={14} className="text-blue-400" />
                <span>Fulfill This Need</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Your Active Contributions Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Your Donation Dispatch Ledger</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent real-time status from donor pickup to recipient door delivery
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold bg-slate-50/50">
                <th className="px-5 py-3">DONATION ID</th>
                <th className="px-5 py-3">PLEDGED ITEM</th>
                <th className="px-5 py-3">BENEFICIARY</th>
                <th className="px-5 py-3">VOLUNTEER ON DUTY</th>
                <th className="px-5 py-3">DISPATCH STATUS</th>
                <th className="px-5 py-3">DATE</th>
                <th className="px-5 py-3 text-center">PROOF / RECEIPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {contributions.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{c.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900">{c.item}</p>
                    <p className="text-[11px] text-slate-500">Quantity: {c.quantity}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900">{c.recipientName}</p>
                    <p className="text-[11px] text-slate-400">{c.recipientLocation}</p>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-700">{c.volunteer}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge type="status" value={c.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{c.date}</td>
                  <td className="px-5 py-3.5 text-center">
                    {c.status === 'COMPLETED' ? (
                      <button
                        onClick={() => setReceiptView(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <FileText size={13} />
                        <span>View Receipt</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Tracking Live</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Receipt Modal Viewer */}
      {receiptView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
            <button 
              onClick={() => setReceiptView(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">VERIFIED DIGITAL RECEIPT</h3>
              <p className="text-[11px] text-slate-500">Community Care Platform Proof-of-Delivery</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between"><span className="text-slate-400">Receipt Ref:</span> <span className="font-mono font-bold text-slate-900">CC-REC-{receiptView.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Donation ID:</span> <span className="font-semibold text-slate-800">{receiptView.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Donor Name:</span> <span className="font-semibold text-slate-800">{currentUser.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Beneficiary:</span> <span className="font-semibold text-slate-800">{receiptView.recipientName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Item & Qty:</span> <span className="font-semibold text-slate-800">{receiptView.item} ({receiptView.quantity})</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Delivery Volunteer:</span> <span className="font-semibold text-slate-800">{receiptView.volunteer}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Date Delivered:</span> <span className="font-semibold text-slate-800">{receiptView.date}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Status:</span> <span className="text-emerald-700 font-bold">RECIPIENT CONFIRMED</span></div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer size={14} />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donate Modal Injection */}
      <DonateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRequest={selectedRequest}
        onSubmitDonation={handleAddDonation}
      />

    </div>
  );
}