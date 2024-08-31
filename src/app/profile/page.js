'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/ProfilePage.module.css';
import { showToast } from '../../../lib/toast'; // Import your showToast function
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function ProfilePage() {
  const [userDetails, setUserDetails] = useState(null);
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      // Fetch user details
      fetch('/api/auth?action=protected-route', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.username) {
            setUserDetails({ username: data.username });

            // Fetch items uploaded by the user
            fetch('/api/items/user-items', {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((res) => res.json())
              .then((data) => {
                setItems(data || []);
              })
              .catch((error) => console.error('Failed to fetch items:', error));
          } else {
            router.push('/login');
          }
        });
    }
  }, [router]);

  const handleDelete = async (itemId) => {
    const token = localStorage.getItem('token');

    const res = await fetch(`/api/items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      showToast('success', 'Item deleted successfully'); // Use showToast for success
      setItems(items.filter((item) => item._id !== itemId));
    } else {
      showToast('error', 'Failed to delete item'); // Use showToast for error
      console.error('Failed to delete item');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
        <button onClick={() => router.push('/add-item')} className={styles.addItemButton}>
          Add New Item
        </button>
      </div>
      <h2 className={styles.itemsTitle}>Your Items</h2>
      <div className={styles.itemsList}>
        {items.length === 0 ? (
          <p className={styles.noItemsMessage}>No items found</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className={styles.itemCard}>
              <img src={item.image} alt={item.itemName} className={styles.itemImage} />
              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.itemName}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
                <p className={styles.itemPrice}>Rs. {item.price}</p>
                <div className={styles.buttonGroup}>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => router.push(`/items/${item._id}/edit`)}
                    className={styles.updateButton}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
}
