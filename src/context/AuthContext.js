// src/context/AuthContext.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);

  const checkUserLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data
      fetch('/api/auth?action=protected-route', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.username) {
            setUsername(data.username);
          } else {
            setUsername(null);
          }
        })
        .catch(() => {
          setUsername(null);
        });
    } else {
      setUsername(null);
    }
  };

  useEffect(() => {
    checkUserLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ username, checkUserLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}