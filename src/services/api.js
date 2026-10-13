const API_BASE = 'http://10.187.190.237:5000/api';

export const api = {
  // Profiles & DP
  getProfile: async (email) => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile/${encodeURIComponent(email)}`);
      return res.ok ? await res.json() : null;
    } catch { return null; }
  },
  updateProfile: async (data) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Aid Requests
  getRequests: async () => {
    const res = await fetch(`${API_BASE}/requests`);
    return res.ok ? await res.json() : [];
  },
  createRequest: async (data) => {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  updateRequestStatus: async (id, status, extra = {}) => {
    const res = await fetch(`${API_BASE}/requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...extra })
    });
    return await res.json();
  },

  // Notifications
  getNotifications: async (role) => {
    try {
      const res = await fetch(`${API_BASE}/notifications?role=${encodeURIComponent(role || 'ALL')}`);
      return res.ok ? await res.json() : [];
    } catch { return []; }
  },
  markNotificationsRead: async () => {
    try {
      await fetch(`${API_BASE}/notifications/mark-read`, { method: 'PATCH' });
    } catch {}
  },

  // Live Chat
  getMessages: async () => {
    try {
      const res = await fetch(`${API_BASE}/messages`);
      return res.ok ? await res.json() : [];
    } catch { return []; }
  },
  sendMessage: async (data) => {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  }
};