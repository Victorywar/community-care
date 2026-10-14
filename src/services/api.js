const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    return `http://${host}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const BASE_URL = getBaseUrl();

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || errData.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  getRequests: () => request('/requests'),
  createRequest: (data) => request('/requests', { method: 'POST', body: JSON.stringify(data) }),
  updateTimelineStep: (id, data) => request(`/requests/${id}/timeline-step`, { method: 'PATCH', body: JSON.stringify(data) }),
  getNotifications: (role) => request(`/notifications?role=${encodeURIComponent(role || 'ALL')}`),
  markNotificationsRead: (role) => request('/notifications/mark-read', { method: 'PATCH', body: JSON.stringify({ role: role || 'ALL' }) }),
  updateProfile: (data) => request('/users/profile', { method: 'PATCH', body: JSON.stringify(data) }),
};