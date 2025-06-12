import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:3001/api/users/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser({ token: res.data.token });
  };

  const register = async (email, password) => {
    try {
      console.log('Dati inviati:', { email, password }); // Debug
      const res = await axios.post('http://localhost:3001/api/users/register', { email, password });
      return res.data;
    } catch (err) {
      console.error('Errore registrazione:', err.response?.data || err.message); // Log dettagli errore
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};