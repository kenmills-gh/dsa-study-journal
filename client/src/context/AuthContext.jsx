import { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data);
        } catch {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.access_token);
    const userRes = await API.get('/auth/me');
    setUser(userRes.data);
  };

  const register = async (username, email, password) => {
    const res = await API.post('/auth/register', { username, email, password });
    localStorage.setItem('token', res.data.access_token);
    const userRes = await API.get('/auth/me');
    setUser(userRes.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};