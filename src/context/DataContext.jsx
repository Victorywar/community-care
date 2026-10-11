import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const STORAGE_KEY = 'community_care_db_v1';

export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse stored data', e);
      }
    }
    return {
      requests: [],
      donations: [],
      volunteers: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addRequest = (newReq) => {
    const item = {
      id: 'REQ-' + Date.now().toString().slice(-4),
      title: newReq.title || 'Emergency Ration / Aid',
      category: newReq.category || 'General',
      recipientName: newReq.recipientName || 'Anonymous Citizen',
      location: newReq.location || 'Local District',
      quantity: newReq.quantity || 1,
      urgency: newReq.urgency || 'high',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      requests: [item, ...prev.requests],
    }));
  };

  const approveRequest = (requestId) => {
    setData((prev) => ({
      ...prev,
      requests: prev.requests.map((r) =>
        r.id === requestId ? { ...r, status: 'approved' } : r
      ),
    }));
  };

  const rejectRequest = (requestId) => {
    setData((prev) => ({
      ...prev,
      requests: prev.requests.map((r) =>
        r.id === requestId ? { ...r, status: 'rejected' } : r
      ),
    }));
  };

  const addVolunteer = (volunteer) => {
    const item = {
      id: 'VOL-' + Date.now().toString().slice(-4),
      name: volunteer.name,
      phone: volunteer.phone,
      status: 'available',
    };
    setData((prev) => ({
      ...prev,
      volunteers: [item, ...prev.volunteers],
    }));
  };

  const addDonation = (donation) => {
    const item = {
      id: 'DON-' + Date.now().toString().slice(-4),
      donorName: donation.donorName || 'Anonymous',
      items: donation.items,
      status: 'matching',
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      donations: [item, ...prev.donations],
    }));
  };

  // Clear everything back to empty
  const clearAllData = () => {
    const cleanState = {
      requests: [],
      donations: [],
      volunteers: [],
    };
    setData(cleanState);
    localStorage.removeItem(STORAGE_KEY);
  };

  const pendingRequestsCount = data.requests.filter((r) => r.status === 'pending').length;
  const approvedRequestsCount = data.requests.filter((r) => r.status === 'approved').length;
  const activeDonationsCount = data.donations.length;
  const activeVolunteersCount = data.volunteers.length;

  return (
    <DataContext.Provider
      value={{
        requests: data.requests,
        donations: data.donations,
        volunteers: data.volunteers,
        stats: {
          pendingRequests: pendingRequestsCount,
          peopleHelped: approvedRequestsCount,
          activeDonations: activeDonationsCount,
          activeVolunteers: activeVolunteersCount,
        },
        addRequest,
        approveRequest,
        rejectRequest,
        addVolunteer,
        addDonation,
        clearAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}