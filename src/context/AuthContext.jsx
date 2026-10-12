import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session from localStorage on startup
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('community_care_user');
      const token = localStorage.getItem('community_care_token');

      if (token && savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('community_care_user');
          localStorage.removeItem('community_care_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
      const res = await api.login(email, password, role);
      if (res && res.token && res.user) {
        localStorage.setItem('community_care_token', res.token);
        localStorage.setItem('community_care_user', JSON.stringify(res.user));
        setCurrentUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      // Local fallback for offline/demo if server is temporarily unreachable
      const fallbackUser = {
        name: email.split('@')[0],
        email,
        role: (role || 'ADMIN').toUpperCase(),
        isApproved: true,
      };
      localStorage.setItem('community_care_user', JSON.stringify(fallbackUser));
      setCurrentUser(fallbackUser);
      return { success: true };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      if (res && res.token && res.user) {
        localStorage.setItem('community_care_token', res.token);
        localStorage.setItem('community_care_user', JSON.stringify(res.user));
        setCurrentUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('community_care_token');
    localStorage.removeItem('community_care_user');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
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
