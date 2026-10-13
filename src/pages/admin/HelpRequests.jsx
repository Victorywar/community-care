import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Clock, MapPin, Tag, RefreshCw } from 'lucide-react';

export default function HelpRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      setRequests(data || []);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">Aid & Relief Registry</h2>
          <p className="text-xs text-slate-400">Manage and assign incoming community assistance requests</p>
        </div>
        <button onClick={fetchRequests} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {requests.map((item, idx) => (
          <div key={item._id || idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.title || item.itemName || 'Assistance Request'}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.location || 'Local Community Sector'}</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                {item.status || 'PENDING'}
              </span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">{item.description || 'No additional notes registered for this requisition.'}</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.quantity || 1} units required</span>
              <button className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700">Dispatch</button>
            </div>
          </div>
        ))}
        {requests.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            No active relief requests found.
          </div>
        )}
      </div>
    </div>
  );
}