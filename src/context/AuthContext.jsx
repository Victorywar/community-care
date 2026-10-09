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
    id: 'USR-ADM-01'
  },
  DONOR: {
    email: 'donor@communitycare.org',
    password: 'Password123!',
    name: 'Anand Kumar',
    role: 'DONOR',
    badge: 'Verified Care Donor',
    id: 'USR-DNR-02'
  },
  VOLUNTEER: {
    email: 'volunteer@communitycare.org',
    password: 'Password123!',
    name: 'Kavitha Raman',
    role: 'VOLUNTEER',
    badge: 'Active Field Volunteer',
    id: 'USR-VOL-03'
  },
  RECEIVER: {
    email: 'receiver@communitycare.org',
    password: 'Password123!',
    name: 'Priya Sundaram',
    role: 'RECEIVER',
    badge: 'Community Recipient',
    id: 'USR-RCV-04'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session from storage on start (ready for web & mobile webview)
  useEffect(() => {
    const savedUser = localStorage.getItem('cc_active_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('cc_active_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, selectedRole) => {
    // Find matching role profile
    const matchedRole = Object.keys(DEMO_CREDENTIALS).find(
      key => DEMO_CREDENTIALS[key].email.toLowerCase() === email.toLowerCase()
    );

    if (matchedRole && DEMO_CREDENTIALS[matchedRole].password === password) {
      const userObj = DEMO_CREDENTIALS[matchedRole];
      setCurrentUser(userObj);
      localStorage.setItem('cc_active_user', JSON.stringify(userObj));
      return { success: true, user: userObj };
    }

    // Allow dynamic custom login if using correct email format
    if (email && password.length >= 6) {
      const dynamicUser = {
        id: `USR-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: selectedRole || 'RECEIVER',
        badge: `${selectedRole || 'RECEIVER'} Account`
      };
      setCurrentUser(dynamicUser);
      localStorage.setItem('cc_active_user', JSON.stringify(dynamicUser));
      return { success: true, user: dynamicUser };
    }

    return { 
      success: false, 
      message: 'Invalid credentials. Please verify your email and password.' 
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cc_active_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);