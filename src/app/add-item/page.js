// src/app/add-item/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/AddItem.module.css';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { showToast } from '../../../lib/toast'; // Import the utility function

export default function AddItem() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [sellerPhoneNumber, setSellerPhoneNumber] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      showToast('error', 'You must be logged in to add an item.');
      return;
    }

    const res = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ itemName, description, price, image, sellerPhoneNumber }),
    });

    if (res.ok) {
      showToast('success', 'Adding Item...!');
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } else {
      showToast('error', 'Failed to add item. Please try again.');
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
          <span className={styles.labelText}>
            Image URL:(Please first upload your image to your drive so that you can paste the url of it)
          </span>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>
            Phone Number:(Phone Number with country code....eg.(+91987654321))
          </span>
          <input
            type="text"
            placeholder="Your phone number"
            value={sellerPhoneNumber}
            onChange={(e) => setSellerPhoneNumber(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>
          Add Item
        </button>
      </form>
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
