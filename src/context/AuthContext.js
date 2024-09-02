// src/context/AuthContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);

  const checkUserLogin = () => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch('/api/auth?action=protected-route', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsername(data.username || null);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setUsername(null);
        });
    } else {
      setUsername(null);
    }
  };

  useEffect(() => {
    checkUserLogin();

    const handleStorageChange = () => {
      checkUserLogin();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
