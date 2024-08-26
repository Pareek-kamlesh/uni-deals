'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../../../styles/ItemDetailPage.module.css'; 

export default function ItemDetailPage({ params }) {
  const { id } = params;
  const [item, setItem] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } 
  }, [router]);

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

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    // Basic phone number validation (you can enhance this)
    const phoneRegex = /^[0-9]{10}$/; // Example: 10-digit phone number
    if (!phoneRegex.test(phoneNumber)) {
      setMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`/api/items/${id}/contact-seller`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber }),
      });
      

      if (res.ok) {
        setMessage('Your contact info has been sent to the seller.');
      } else {
        setMessage('Failed to send contact info. Please try again.');
      }
    } catch (error) {
      console.error('Error sending contact info:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <img src={item.image} alt={item.itemName} className={styles.itemImage} />
      <h1 className={styles.itemName}>{item.itemName}</h1>
      <p className={styles.itemDescription}>{item.description}</p>
      <p className={styles.itemPrice}>Rs. {item.price}</p>
      <p className={styles.postedDate}>Posted on: {formatDate(item.postedDate)}</p>

      {/* Contact Seller Form */}
      <div className={styles.contactSeller}>
        <h2>Contact Seller</h2>
        <form onSubmit={handleContactSubmit}>
          <input 
            type="text" 
            placeholder="Your phone number" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required 
            className={styles.inputField}
          />
          <button type="submit" className={styles.submitButton}>Send</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
