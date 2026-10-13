const API_BASE = 'http://10.187.190.237:5000/api';

const authHeader = () => {
  const token = localStorage.getItem('cc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Requests API
  getRequests: async () => {
    const res = await fetch(`${API_BASE}/requests`, { headers: { ...authHeader() } });
    if (!res.ok) throw new Error('Failed to fetch requests');
    return await res.json();
  },

  createRequest: async (data) => {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create request');
    return await res.json();
  },

  updateRequestStatus: async (id, status, extra = {}) => {
    const res = await fetch(`${API_BASE}/requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ status, ...extra }),
    });
    if (!res.ok) throw new Error('Failed to update request');
    return await res.json();
  },

  // Donations API
  getDonations: async () => {
    const res = await fetch(`${API_BASE}/donations`, { headers: { ...authHeader() } });
    if (!res.ok) throw new Error('Failed to fetch donations');
    return await res.json();
  },

  createDonation: async (data) => {
    const res = await fetch(`${API_BASE}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to register donation');
    return await res.json();
  },

  // Chat / Messages API
  getMessages: async () => {
    const res = await fetch(`${API_BASE}/messages`, { headers: { ...authHeader() } });
    if (!res.ok) return [];
    return await res.json();
  },

  sendMessage: async (text) => {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ text }),
    });
    return await res.json();
  }
};