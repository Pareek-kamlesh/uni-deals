'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/ItemsPage.module.css';

// Function to format the date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ItemsPage({ searchQuery }) {
  const [items, setItems] = useState([]);
  const router = useRouter();
  const containerRef = useRef(null); // Create a ref for the container

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

    // Restore scroll position
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      containerRef.current.scrollTo(0, parseInt(savedScrollPosition, 10));
    }
  }, []);

  const handleItemClick = (itemId) => {
    // Save scroll position
    sessionStorage.setItem('scrollPosition', containerRef.current.scrollTop);
    router.push(`/items/${itemId}`);
  };

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.itemGrid}>
        {filteredItems.map(item => (
          <div key={item._id} className={styles.itemCard}>
            <img src={item.image} alt={item.itemName} className={styles.itemImage} />
            <h3 className={styles.itemName}>{item.itemName}</h3>
            <p className={styles.itemDescription}>{item.description}</p>
            <p className={styles.itemPrice}>Rs. {item.price}</p>
            <p className={styles.postedDate}>Posted on: {formatDate(item.postedDate)}</p>
            <button 
              onClick={() => handleItemClick(item._id)} 
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