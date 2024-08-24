'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../../../styles/ItemDetailPage.module.css'; 

export default function ItemDetailPage({ params }) {
  const { id } = params;
  const [item, setItem] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchItem() {
      const res = await fetch(`/api/items/${id}`);
      if (res.ok) {
        const data = await res.json();
        setItem(data);
      } else {
        console.error('Failed to fetch item');
        router.push('/'); // Redirect if item is not found
      }
    }

    fetchItem();
  }, [id, router]);

  if (!item) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <img src={item.image} alt={item.itemName} className={styles.itemImage} />
      <h1 className={styles.itemName}>{item.itemName}</h1>
      <p className={styles.itemDescription}>{item.description}</p>
      <p className={styles.itemPrice}>Rs. {item.price}</p>
      {/* Remove the delete button here */}
    </div>
  );
}
