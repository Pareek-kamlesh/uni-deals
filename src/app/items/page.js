'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/ItemsPage.module.css';

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const router = useRouter();

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

  return (
    <div className={styles.container}>
      <div className={styles.itemGrid}>
        {items.map(item => (
          <div key={item._id} className={styles.itemCard}>
            <img src={item.image} alt={item.itemName} className={styles.itemImage} />
            <h3 className={styles.itemName}>{item.itemName}</h3>
            <p className={styles.itemDescription}>{item.description}</p>
            <p className={styles.itemPrice}>${item.price}</p>
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
