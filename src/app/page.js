'use client';
import { useEffect, useState } from 'react';
import ItemsPage from './items/page';  // Import ItemsPage
import styles from '../../styles/HomePage.module.css';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    // Simulate data fetching or any other initialization logic
    setTimeout(() => {
      setLoading(false); // Stop loading after initialization
    }, 1000); // Simulate a delay for demonstration purposes
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchBar}
      />
      <ItemsPage searchQuery={searchQuery} />
    </div>
  );
}