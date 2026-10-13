const API_BASE = 'http://10.187.190.237:5000/api';

export const api = {
  getRequests: async () => {
    try {
      const res = await fetch(`${API_BASE}/requests`);
      return res.ok ? await res.json() : [];
    } catch { return []; }
  },

  createRequest: async (data) => {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  updateTimelineStep: async (id, data) => {
    const res = await fetch(`${API_BASE}/requests/${id}/timeline-step`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  getUsers: async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      return res.ok ? await res.json() : [];
    } catch { return []; }
  },

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
      body: JSON.stringify(data),
    });
    return await res.json();
  },

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
  }
};