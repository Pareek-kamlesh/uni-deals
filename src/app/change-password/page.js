'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/ChangePasswordPage.module.css'; // Ensure this path is correct

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } 
  }, [router]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const res = await fetch('/api/auth?action=change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.ok) {
      // Password changed successfully
      router.push('/profile');
    } else {
      // Handle errors
      const data = await res.json();
      alert(data.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Change Password</h1>
      <form onSubmit={handleChangePassword}>
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword" className={styles.label}>Current Password</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="newPassword" className={styles.label}>New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Change Password</button>
      </form>
    </div>
  );
}
