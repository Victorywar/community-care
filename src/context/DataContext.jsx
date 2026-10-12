import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real DB fetch
  const refreshAllData = async () => {
    const token = localStorage.getItem('community_care_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [reqsRes, donsRes] = await Promise.all([
        api.getRequests(),
        api.getDonations()
      ]);

      if (Array.isArray(reqsRes)) {
        const formattedReqs = reqsRes.map((r) => ({
          id: r.requestId || r._id,
          rawId: r._id,
          title: r.itemName,
          recipientName: r.recipientName,
          location: r.deliveryAddress,
          quantity: `${r.quantityNeeded} ${r.unit || ''}`.trim(),
          category: r.category,
          urgency: r.urgency || 'MEDIUM',
          status: r.status || 'PENDING',
          assignedVolunteer: r.assignedVolunteer || 'Unassigned',
          description: r.description || '',
          createdAt: r.createdAt ? new Date(r.createdAt).toLocaleString() : 'Just now',
          timeline: r.timeline || [
            {
              stage: 'Request Registered',
              desc: 'Beneficiary submitted request.',
              time: r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recorded',
              agent: r.recipientName || 'Recipient'
            }
          ]
        }));
        setRequests(formattedReqs);

        // Derive receipts dynamically from fulfilled deliveries
        const fulfilledReceipts = formattedReqs
          .filter(r => r.status === 'FULFILLED')
          .map(r => ({
            id: `RCP-${r.id.slice(-5)}`,
            reqId: r.id,
            item: r.title,
            beneficiary: r.recipientName,
            volunteer: r.assignedVolunteer,
            location: r.location,
            completedAt: r.createdAt,
            hash: `0x${r.rawId || 'hash948a2'}`
          }));
        setReceipts(fulfilledReceipts);
      }

      if (Array.isArray(donsRes)) {
        const formattedDons = donsRes.map((d) => ({
          id: d.donationId || d._id,
          donorName: d.donorName,
          category: d.category,
          type: d.category === 'Emergency Funds' ? 'FINANCIAL' : 'IN_KIND',
          amountOrQty: `${d.totalQuantity || ''} ${d.unit || ''}`.trim() || 'Supplies',
          date: d.createdAt ? new Date(d.createdAt).toISOString().split('T')[0] : 'Today',
          status: d.status || 'Verified'
        }));
        setDonations(formattedDons);
      }
    } catch (err) {
      console.error('Failed to sync data with DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Actions connecting to real DB endpoints
  const addRequest = async (newReq) => {
    try {
      const res = await api.createRequest(newReq);
      await refreshAllData();
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  const addDonation = async (newDon) => {
    try {
      const res = await api.createDonation(newDon);
      await refreshAllData();
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  const updateRequestStatus = async (id, status, assignedVolunteer = '') => {
    try {
      await api.updateRequestStatus(id, status, assignedVolunteer);
      await refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DataContext.Provider
      value={{
        requests,
        donations,
        receipts,
        loading,
        refreshAllData,
        addRequest,
        addDonation,
        updateRequestStatus
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);