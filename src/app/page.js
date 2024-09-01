'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ItemsPage from './items/page';  // Import ItemsPage
import styles from '../../styles/HomePage.module.css';

export default function HomePage() {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debugging

    if (!token) {
      
      router.push('/login');
      return;
    }

    // Fetch user data
    fetch('/api/auth?action=protected-route', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('User Data:', data); // Debugging
        if (data.message && data.message.startsWith('Welcome')) {
          setUsername(data.username);
          setLoading(false); // Stop loading when data is fetched
        } else {
          router.push('/login');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        router.push('/login');
      });
  }, [router]);

  useEffect(() => {
    if (!loading) {
      // Scroll to the top when the component is not loading
      window.scrollTo(0, 0);
    }
  }, [loading]); // Triggered when loading state changes

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <ItemsPage />
    </div>
  );
}
