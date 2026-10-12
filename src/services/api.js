const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('community_care_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  login: async (email, password, role) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Relief Requests
  getRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      headers: getHeaders()
    });
    return res.json();
  },

  createRequest: async (data) => {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateRequestStatus: async (requestId, status, assignedVolunteer = '') => {
    const res = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, assignedVolunteer })
    });
    return res.json();
  },

  // Donations
  getDonations: async () => {
    const res = await fetch(`${API_BASE_URL}/donations`, {
      headers: getHeaders()
    });
    return res.json();
  },

  createDonation: async (data) => {
    const res = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Admin Members & Volunteer Approval
  getMembers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/members`, {
      headers: getHeaders()
    });
    return res.json();
  },

  updateMemberStatus: async (memberId, isApproved) => {
    const res = await fetch(`${API_BASE_URL}/admin/members/${memberId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ isApproved })
    });
    return res.json();
  },

  // Notifications
  getNotifications: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/notifications`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Live Relay Chat
  getMessages: async () => {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      headers: getHeaders()
    });
    return res.json();
  },

  sendMessage: async (text) => {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
    return res.json();
  }
};
