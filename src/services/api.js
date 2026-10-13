// Automatic base URL detection: Use network IP on native mobile, localhost on web browser
const isNative = window.Capacitor !== undefined || window.location.protocol === 'capacitor:';
export const API_BASE_URL = isNative
  ? 'http://10.187.190.237:5000/api'
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');

const getAuthHeaders = () => {
  const token = localStorage.getItem('community_care_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Session invalid');
    return res.json();
  },

  // Requests
  getRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  },

  createRequest: async (requestData) => {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create request');
    }
    return res.json();
  },

  confirmReceipt: async (id, remarks) => {
    const res = await fetch(`${API_BASE_URL}/requests/${id}/confirm`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ remarks })
    });
    if (!res.ok) throw new Error('Failed to confirm receipt');
    return res.json();
  }
};