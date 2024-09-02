// src/components/Header.js
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from '../styles/Header.module.css';

export default function Header() {
  const { username, checkUserLogin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    checkUserLogin(); // Ensure context updates

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [checkUserLogin]);

  useEffect(() => {
    const handleRouteChange = () => {
      setMenuOpen(false);
    };

    router.events?.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events?.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <a href="/" className={styles.navLink}>
              Uni-Deals
            </a>
          </li>
          {username ? (
            <li className={styles.navItem}>
              <div className={`${styles.usernameMenu} ${menuOpen ? 'open' : ''}`} ref={menuRef}>
                <span className={styles.usernameButton} onClick={toggleMenu}>
                  {username[0]}
                </span>
                <div className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}>
                  <Link href="/profile" className={styles.menuLink} onClick={handleMenuClick}>Profile</Link>
                  <Link href="/change-password" className={styles.menuLink} onClick={handleMenuClick}>Change Password</Link>
                  <a href="/logout" className={styles.menuLink} onClick={handleMenuClick}>Logout</a>
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
