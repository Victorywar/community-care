import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Default mock credentials for all 4 roles to allow instant testing
export const DEMO_CREDENTIALS = {
  ADMIN: {
    email: 'admin@communitycare.org',
    password: 'Password123!',
    name: 'Sarah Jenkins',
    role: 'ADMIN',
    badge: 'Platform Administrator',
    id: 'USR-ADM-01',
  },
  DONOR: {
    email: 'donor@communitycare.org',
    password: 'Password123!',
    name: 'Anand Kumar',
    role: 'DONOR',
    badge: 'Verified Care Donor',
    id: 'USR-DNR-02',
  },
  VOLUNTEER: {
    email: 'volunteer@communitycare.org',
    password: 'Password123!',
    name: 'Kavitha Raman',
    role: 'VOLUNTEER',
    badge: 'Active Field Volunteer',
    id: 'USR-VOL-03',
  },
  RECEIVER: {
    email: 'receiver@communitycare.org',
    password: 'Password123!',
    name: 'Priya Sundaram',
    role: 'RECEIVER',
    badge: 'Authentic Aid Recipient',
    id: 'USR-RCV-04',
  },
};

const AUTH_STORAGE_KEY = 'community_care_user';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    }
    // Default to null so user lands on login page first
    return null;
  });

  const [loading, setLoading] = useState(false);

  // Instant login handler without external API dependencies
  const login = (email, password, role) => {
    const userRole = (role || 'ADMIN').toUpperCase();
    const matchedUser = DEMO_CREDENTIALS[userRole] || {
      email: email || 'admin@communitycare.org',
      role: userRole,
      name: 'System User',
      badge: `${userRole} Access`,
      id: 'USR-' + Date.now().toString().slice(-4),
    };

    setCurrentUser(matchedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
    return matchedUser;
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        logout,
        DEMO_CREDENTIALS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}