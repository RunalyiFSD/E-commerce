import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [isLoading, setIsLoading] = useState(true);

  // Restore Session on App Launch
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } catch (error) {
          console.warn('[Session Restore Failed] Clearing invalid token');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken('');
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { user: userData, token: jwtToken } = res.data;

      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setIsLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    }
  }, []);

  // Register handler
  const register = useCallback(async (formData) => {
    setIsLoading(true);
    try {
      const res = await API.post('/auth/register', formData);
      const { user: userData, token: jwtToken } = res.data;

      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setIsLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    }
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken('');
    try {
      API.post('/auth/logout');
    } catch (e) {}
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setUser,
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

export default AuthProvider;
