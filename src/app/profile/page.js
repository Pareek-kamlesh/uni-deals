'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/ProfilePage.module.css'; // Ensure this path is correct

export default function ProfilePage() {
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      fetch('/api/auth?action=protected-route', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.username) {
            setUserDetails({ username: data.username });
          } else {
            router.push('/login');
          }
        });
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile</h1>
      <p className={styles.text}>Username: {userDetails?.username}</p>
    </div>
  );
}
