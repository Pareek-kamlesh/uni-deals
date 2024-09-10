// src/pages/change-password.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/ChangePasswordPage.module.css'; // Ensure this path is correct
import { showToast } from '../../../lib/toast'; // Import your showToast function
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import withAuth from '../../../components/withAuth';

function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/auth?action=change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        showToast('success', 'Password changed successfully.');
        setTimeout(() => {
          router.push('/profile');
        }, 2000); // Use showToast for success
      } else {
        const data = await res.json();
        showToast('error', data.message || 'Failed to change password.'); // Use showToast for error
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showToast('error', 'An error occurred. Please try again.'); // Use showToast for error
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
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
}

export default withAuth(ChangePasswordPage);