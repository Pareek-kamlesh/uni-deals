'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/RegisterPage.module.css'; // Import CSS module
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { showToast } from '../../../lib/toast'; // Import the utility function
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('');
  const [college, setCollege] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      router.push('/');
    } 
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('error', 'Passwords do not match');  // Show toast for mismatched passwords
      return;
    }

    // Normalize city and college names
    const normalizedCity = city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase();
    const normalizedCollege = college.trim().toUpperCase();

    const res = await fetch('/api/auth?action=register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username, city: normalizedCity, college: normalizedCollege }),
    });

    if (res.ok) {
      showToast('success', 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      showToast('error', 'Registration failed. Please try again.');  // Show toast for failed registration
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          className={styles.input}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="text"
          placeholder="College"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          required
          className={styles.input}
        />
        <button className={styles.button} type="submit">Register</button>
        <div className={styles.loginLink}>
          Already have an account? <Link href="/login">Click here!</Link>
        </div>
      </form>
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
