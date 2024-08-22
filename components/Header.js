'use client'; // Ensure this is a Client Component

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css'; // Update path if needed

export default function Header() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
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
          if (data.username) {
            setUsername(data.username);
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, []);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/" className={styles.navLink}>Home</Link>
          </li>
          {username ? (
            <li className={styles.navItem}>
              <div className={styles.usernameMenu}>
                <span className={styles.usernameButton}>
                  {username[0]} {/* Display the first letter of the username */}
                </span>
                <div className={styles.menu}>
                  <Link href="/profile" className={styles.menuLink}>Profile</Link>
                  <Link href="/change-password" className={styles.menuLink}>Change Password</Link>
                  <Link href="/logout" className={styles.menuLink}>Logout</Link>
                </div>
              </div>
            </li>
          ) : (
            <>
              <li className={styles.navItem}>
                <Link href="/login" className={styles.navLink}>Login</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/register" className={styles.navLink}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
