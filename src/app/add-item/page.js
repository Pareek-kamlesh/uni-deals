'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/AddItem.module.css'; // Adjust path as needed

export default function AddItem() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } 
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    const res = await fetch('/api/items', { // Update endpoint to /api/items
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Send token in the Authorization header
      },
      body: JSON.stringify({ itemName, description, price, image }),
    });

    if (res.ok) {
      router.push('/items'); // Redirect to items page after successful addition
    } else {
      console.error('Failed to add item');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add New Item</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <span className={styles.labelText}>Item Name:</span>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>Description:</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={styles.textarea}
          />
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>Price:</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>Image URL: (You can upload your object's image to your drive and then paste a link of it here)</span>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>
          Add Item
        </button>
      </form>
    </div>
  );
}
