// src/pages/login.js
'use client';
import { useState, useEffect } from 'react';
import styles from '../../../styles/LoginPage.module.css';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../../../lib/toast';  // Import the utility function
import { useAuth } from 'src/context/AuthContext';// Import useAuth

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { checkUserLogin } = useAuth(); // Get checkUserLogin from context

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    const currentTime = new Date().getTime();

    if (token && tokenExpiry && currentTime < tokenExpiry) {
      router.push('/');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      showToast('info', 'Please login!!');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth?action=login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { token, expiresIn } = await res.json();
      const expiryDate = new Date().getTime() + expiresIn * 1000;
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expiryDate);
      showToast('success', 'Login successful! Redirecting...');
      checkUserLogin(); // Update context
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      showToast('error', 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          className={styles.input}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={styles.button} type="submit">Login</button>
      </form>
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}