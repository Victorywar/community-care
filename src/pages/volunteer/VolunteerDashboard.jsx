import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Camera, 
  Navigation, 
  ArrowRight, 
  Phone,
  Radio,
  Check
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import ProofOfDeliveryModal from './ProofOfDeliveryModal';

const initialVolunteerTasks = [
  {
    id: 'DEL-801',
    donationId: 'DON-401',
    item: 'Insulin and Chronic Medication Support',
    quantity: '2 Months Supply',
    donorName: 'Anand Kumar',
    donorPhone: '+91 98401 22334',
    pickupAddress: 'Greenways Road, RA Puram',
    recipientName: 'Priya Sundaram',
    recipientPhone: '+91 94440 55667',
    deliveryAddress: 'Gandhi Nagar, Ward 4',
    urgency: 'Critical',
    status: 'IN_TRANSIT',
  },
  {
    id: 'DEL-802',
    donationId: 'DON-405',
    item: 'Dry Ration and Cooking Oil Package',
    quantity: '2 Family Grocery Packs',
    donorName: 'Meenakshi Enterprises',
    donorPhone: '+91 98840 88990',
    pickupAddress: 'Anna Nagar West Depot',
    recipientName: 'Selvam Murugan',
    recipientPhone: '+91 97910 11223',
    deliveryAddress: 'North Street, Colony 2',
    urgency: 'High',
    status: 'ASSIGNED',
  },
  {
    id: 'DEL-799',
    donationId: 'DON-398',
    item: 'Fresh Cooked Meals',
    quantity: '100 Meal Boxes',
    donorName: 'Anand Kumar',
    donorPhone: '+91 98401 22334',
    pickupAddress: 'Greenways Road, RA Puram',
    recipientName: 'Arulmozhi Varman',
    recipientPhone: '+91 98412 33445',
    deliveryAddress: 'Community Shelter 2',
    urgency: 'Normal',
    status: 'DELIVERED',
  }
];

export default function VolunteerDashboard({ currentUser }) {
  const [tasks, setTasks] = useState(initialVolunteerTasks);
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeProofModal, setActiveProofModal] = useState(null);

  // Stepper: ASSIGNED -> ACCEPTED -> PICKED_UP -> IN_TRANSIT
  const handleAdvanceStatus = (taskId, nextStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
  };

  const handleOpenProofModal = (task) => {
    setActiveProofModal(task);
  };

  const handleCompletePoD = (taskId, proofData) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: 'DELIVERED', proof: proofData } : t
    ));
    alert(`Success! Delivery proof submitted for ${taskId}. Recipient confirmation pending.`);
  };

  return (
    <div className="space-y-6">

      {/* Top Banner: Status & Duty Toggle */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Truck size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Field Volunteer Dispatch Console
            </h3>
            <p className="text-xs text-slate-500">
              Logged in as <span className="font-semibold text-slate-800">{currentUser?.name || 'Kavitha Raman'}</span> (ID: CC-VOL-03)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600">Volunteer Duty Status:</span>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isAvailable 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' 
                : 'bg-slate-100 text-slate-600 border border-slate-300'
            }`}
          >
            <Radio size={14} className={isAvailable ? 'text-emerald-600 animate-pulse' : 'text-slate-400'} />
            <span>{isAvailable ? 'On-Duty (Available)' : 'Off-Duty'}</span>
          </button>
        </div>
      </div>

      {/* 4 Metrics for Volunteer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Pickup</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {tasks.filter(t => t.status === 'ASSIGNED' || t.status === 'ACCEPTED').length}
            </h3>
            <span className="text-[11px] text-amber-600 font-medium">Ready for collection</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">In-Transit</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {tasks.filter(t => t.status === 'IN_TRANSIT' || t.status === 'PICKED_UP').length}
            </h3>
            <span className="text-[11px] text-blue-600 font-medium">On the road</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Navigation size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completed Deliveries</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {tasks.filter(t => t.status === 'DELIVERED').length}
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium">Proof verified</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Direct Beneficiaries</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">102</h3>
            <span className="text-[11px] text-teal-600 font-medium">Delivered to hands</span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <Truck size={22} />
          </div>
        </div>
      </div>

      {/* Dispatch Tasks Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Assigned Delivery Pipeline</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              
              {/* Task Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded">
                      {task.id}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Ref: {task.donationId}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge type="urgency" value={task.urgency} />
                    <StatusBadge type="status" value={task.status} />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {task.item}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Package Size: <span className="text-slate-800 font-semibold">{task.quantity}</span>
                </p>
              </div>

              {/* Waypoints Route: Pickup -> Destination */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2.5">
                {/* Pickup */}
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      Pickup: {task.donorName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                      <MapPin size={11} className="shrink-0" /> {task.pickupAddress}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Phone size={10} className="shrink-0" /> {task.donorPhone}
                    </p>
                  </div>
                </div>

                {/* Divider Line */}
                <div className="border-l-2 border-dashed border-slate-300 ml-2.5 h-3"></div>

                {/* Drop-off */}
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                    B
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      Drop-off: {task.recipientName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                      <MapPin size={11} className="shrink-0" /> {task.deliveryAddress}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Phone size={10} className="shrink-0" /> {task.recipientPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sequential Action Controls */}
              <div className="pt-2 border-t border-slate-100">
                {task.status === 'ASSIGNED' && (
                  <button
                    onClick={() => handleAdvanceStatus(task.id, 'ACCEPTED')}
                    className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Check size={14} />
                    <span>Accept Assignment</span>
                  </button>
                )}

                {task.status === 'ACCEPTED' && (
                  <button
                    onClick={() => handleAdvanceStatus(task.id, 'PICKED_UP')}
                    className="w-full py-2 px-3 rounded-lg bg-[#0b1329] hover:bg-[#152244] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Truck size={14} className="text-blue-400" />
                    <span>Confirm Item Picked Up from Donor</span>
                  </button>
                )}

                {task.status === 'PICKED_UP' && (
                  <button
                    onClick={() => handleAdvanceStatus(task.id, 'IN_TRANSIT')}
                    className="w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Navigation size={14} />
                    <span>Start Transit to Recipient</span>
                  </button>
                )}

                {task.status === 'IN_TRANSIT' && (
                  <button
                    onClick={() => handleOpenProofModal(task)}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Camera size={14} />
                    <span>Arrived at Recipient · Upload Proof (PoD)</span>
                  </button>
                )}

                {task.status === 'DELIVERED' && (
                  <div className="w-full py-2 px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={15} />
                    <span>Delivered · Awaiting Recipient Confirm</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Proof of Delivery Modal Injection */}
      <ProofOfDeliveryModal
        isOpen={!!activeProofModal}
        onClose={() => setActiveProofModal(null)}
        delivery={activeProofModal}
        onConfirmDelivery={handleCompletePoD}
      />

    </div>
  );
}