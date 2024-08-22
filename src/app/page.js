'use client'; // Add this directive to mark the component as a Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct for App Router
import styles from '../../styles/HomePage.module.css'; // Ensure this path is correct

export default function HomePage() {
  const [username, setUsername] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      fetch('/api/auth?action=protected-route', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('API Response:', data); // Debugging: Check the actual API response

          if (data.message && data.message.startsWith('Welcome')) {
            // Adjust based on the actual response format
            setUsername(data.message.split(' ')[1]); // Modify this if the format is different
          } else {
            router.push('/login');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error); // Error handling
          router.push('/login');
        });
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <h1>Welcome, {username || 'Loading...'}</h1> {/* Show 'Loading...' if username is null */}
    </div>
  );
}
