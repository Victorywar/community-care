import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

const STORAGE_KEY_REQUESTS = 'community_care_requests';
const STORAGE_KEY_DONATIONS = 'community_care_donations';
const STORAGE_KEY_RECEIPTS = 'community_care_receipts';

export function DataProvider({ children }) {
  // Live state initialized from localStorage
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REQUESTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [donations, setDonations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DONATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [receipts, setReceipts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RECEIPTS);
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(receipts));
  }, [receipts]);

  // Helper to generate a realistic cryptographic hex hash
  const generateHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 40; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  // Add a new relief request with full timeline initiation
  const addRequest = (newReq) => {
    const timestamp = new Date().toLocaleString();
    const reqItem = {
      id: 'REQ-' + Date.now().toString().slice(-5),
      createdAt: timestamp,
      status: 'PENDING',
      timeline: [
        {
          stage: 'Request Logged',
          desc: 'Beneficiary registered aid ticket in the community portal.',
          time: timestamp,
          agent: 'Portal Verification Engine'
        }
      ],
      ...newReq,
    };
    setRequests((prev) => [reqItem, ...prev]);
    return reqItem;
  };

  // Progress request timeline stage & trigger automated digital receipt upon fulfillment
  const updateRequestStatus = (id, newStatus, agentName = 'Central Dispatch Admin') => {
    const timestamp = new Date().toLocaleString();

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          const nextTimeline = [
            ...(req.timeline || []),
            {
              stage: newStatus === 'IN_PROGRESS' ? 'Volunteer Dispatched' : 'Aid Fulfilled & Verified',
              desc:
                newStatus === 'IN_PROGRESS'
                  ? `Assigned to regional dispatch unit. Transport active.`
                  : `Aid handed over to ${req.recipientName || 'Beneficiary'}. Sign-off confirmed.`,
              time: timestamp,
              agent: agentName,
            },
          ];

          // If marked fulfilled, automatically append an immutable Digital Receipt
          if (newStatus === 'FULFILLED') {
            const newReceipt = {
              id: 'RCP-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-4),
              requestId: req.id,
              donor: req.donorName || 'Community Aid Reserve',
              item: `${req.quantity || '1 Kit'} - ${req.title}`,
              beneficiary: `${req.recipientName} (${req.location})`,
              date: new Date().toISOString().split('T')[0],
              timestamp: timestamp,
              hash: generateHash(),
              status: 'VERIFIED',
              timeline: nextTimeline
            };
            setReceipts((existing) => [newReceipt, ...existing]);
          }

          return { ...req, status: newStatus, timeline: nextTimeline };
        }
        return req;
      })
    );
  };

  // Add donation and record initial receipt
  const addDonation = (newDon) => {
    const timestamp = new Date().toLocaleString();
    const donationItem = {
      id: 'DON-' + Date.now().toString().slice(-5),
      createdAt: timestamp,
      ...newDon,
    };
    setDonations((prev) => [donationItem, ...prev]);

    // Generate verified receipt for financial/inventory donations
    const newReceipt = {
      id: 'RCP-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-4),
      donor: newDon.donorName,
      item: `${newDon.amountOrQty} (${newDon.category})`,
      beneficiary: 'Community Central Warehouse',
      date: new Date().toISOString().split('T')[0],
      timestamp: timestamp,
      hash: generateHash(),
      status: 'VERIFIED',
      timeline: [
        {
          stage: 'Donation Deposited',
          desc: `Logged into warehouse registry under ${newDon.category}.`,
          time: timestamp,
          agent: 'Asset Vault Service'
        }
      ]
    };
    setReceipts((prev) => [newReceipt, ...prev]);
  };

  return (
    <DataContext.Provider
      value={{
        requests,
        donations,
        receipts,
        addRequest,
        updateRequestStatus,
        addDonation,
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