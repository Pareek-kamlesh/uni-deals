'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { showToast } from '../../../lib/toast'; // Import the utility function

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear the token from local storage
    localStorage.removeItem('token');

    // Show toast notification for logout
    showToast('success', 'Successfully logged out!');

    // Redirect to the login page after a short delay
    setTimeout(() => {
      router.replace('/login');
    }, 2000);
  }, [router]);

  return (
    <div>
      <p>Logging out...</p>
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
