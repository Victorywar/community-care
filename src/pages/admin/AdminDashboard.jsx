import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Plus, 
  Filter, 
  Search, 
  HeartHandshake, 
  Users, 
  Clock, 
  Truck 
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const initialRequests = [
  {
    id: 'REQ-101',
    receiverName: 'Priya Sundaram',
    receiverEmail: 'priya.s@carecommunity.org',
    category: 'Medicine',
    title: 'Insulin and Chronic Medication Support',
    quantity: '2 Months Supply',
    urgency: 'Critical',
    location: 'Gandhi Nagar, Ward 4',
    status: 'PENDING',
    submittedAt: 'Today, 10:30 AM'
  },
  {
    id: 'REQ-102',
    receiverName: 'Selvam Murugan',
    receiverEmail: 'selvam.m@mail.com',
    category: 'Food',
    title: 'Dry Ration Kits for Elderly Home',
    quantity: '15 Grocery Kits',
    urgency: 'High',
    location: 'North Street, Colony 2',
    status: 'PENDING',
    submittedAt: 'Today, 08:15 AM'
  },
  {
    id: 'REQ-103',
    receiverName: 'Fatima Begum',
    receiverEmail: 'fatima.b@welfare.org',
    category: 'Clothes',
    title: 'Warm Blankets & Children Clothing',
    quantity: '30 Units',
    urgency: 'Normal',
    location: 'Railway Colony Road',
    status: 'APPROVED',
    submittedAt: 'Yesterday, 04:45 PM'
  },
  {
    id: 'REQ-104',
    receiverName: 'Ravi Teja',
    receiverEmail: 'ravi.t@community.org',
    category: 'Education',
    title: 'Notebooks and School Kits for Primary Students',
    quantity: '50 Kits',
    urgency: 'Normal',
    status: 'APPROVED',
    location: 'East Tambaram',
    submittedAt: 'Yesterday, 02:20 PM'
  }
];

export default function AdminDashboard() {
  const [requests, setRequests] = useState(initialRequests);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterUrgency, setFilterUrgency] = useState('All');

  const handleApprove = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
  };

  const handleReject = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
  };

  const filteredRequests = requests.filter(r => {
    const matchCategory = filterCategory === 'All' || r.category === filterCategory;
    const matchUrgency = filterUrgency === 'All' || r.urgency === filterUrgency;
    return matchCategory && matchUrgency;
  });

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Requests</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {requests.filter(r => r.status === 'PENDING').length}
            </h3>
            <span className="text-[11px] text-amber-600 font-medium">Needs Verification</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Donations</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">28</h3>
            <span className="text-[11px] text-blue-600 font-medium">In Matching & Transit</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <HeartHandshake size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">People Helped</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">1,420</h3>
            <span className="text-[11px] text-emerald-600 font-medium">+18 this week</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Volunteers</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">45</h3>
            <span className="text-[11px] text-teal-600 font-medium">Available on duty</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <Truck size={22} />
          </div>
        </div>
      </div>

      {/* Main Request Verification Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Incoming Help Requests</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify medical, ration, and essential requests before donors can fulfill them
              </p>
            </div>
            <button
              onClick={() => alert('Log direct request modal open')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>Log Direct Request</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search requests by recipient name, title or area..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Food">Food</option>
                <option value="Medicine">Medicine</option>
                <option value="Clothes">Clothes</option>
                <option value="Education">Education</option>
              </select>

              <select 
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Urgency</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
              </select>

              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer">
                <Filter size={13} />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold bg-slate-50/50">
                <th className="px-5 py-3">REQ ID</th>
                <th className="px-5 py-3">RECIPIENT</th>
                <th className="px-5 py-3">REQUEST ITEM & TITLE</th>
                <th className="px-5 py-3">CATEGORY</th>
                <th className="px-5 py-3">URGENCY</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3">LOCATION</th>
                <th className="px-5 py-3 text-center">VERIFICATION ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{req.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900">{req.receiverName}</p>
                    <p className="text-[11px] text-slate-400">{req.receiverEmail}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-900">{req.title}</p>
                    <p className="text-[11px] text-slate-500 font-medium">Qty: {req.quantity}</p>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-700">{req.category}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge type="urgency" value={req.urgency} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge type="status" value={req.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{req.location}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      {req.status === 'PENDING' ? (
                        <>
                          <button 
                            onClick={() => handleApprove(req.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-[11px] font-semibold cursor-pointer transition-colors"
                          >
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button 
                            onClick={() => handleReject(req.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-semibold cursor-pointer transition-colors"
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => alert(`Viewing details for ${req.id}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-medium cursor-pointer transition-colors"
                        >
                          <Eye size={12} /> View File
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredRequests.length} verified & pending records</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded font-medium">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}