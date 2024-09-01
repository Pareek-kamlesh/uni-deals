'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/ItemsPage.module.css';

// Function to format the date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const router = useRouter();
  const containerRef = useRef(null); // Create a ref for the container

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } 
  }, [router]);

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch('/api/items');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        console.error('Failed to fetch items');
      }
    }

    fetchItems();
  }, []);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth', // Optional: for smooth scrolling effect
      });
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.itemGrid}>
        {items.map(item => (
          <div key={item._id} className={styles.itemCard}>
            <img src={item.image} alt={item.itemName} className={styles.itemImage} />
            <h3 className={styles.itemName}>{item.itemName}</h3>
            <p className={styles.itemDescription}>{item.description}</p>
            <p className={styles.itemPrice}>Rs. {item.price}</p>
            <p className={styles.postedDate}>Posted on: {formatDate(item.postedDate)}</p>
            <button 
              onClick={() => router.push(`/items/${item._id}`)} 
              className={styles.viewDetailsButton}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
