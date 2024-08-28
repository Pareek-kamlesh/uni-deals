'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../../../styles/ItemDetailPage.module.css'; 

export default function ItemDetailPage({ params }) {
  const { id } = params;
  const [item, setItem] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // Track success or failure
  const [isLoading, setIsLoading] = useState(false); // Track loading status
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
      setIsSuccess(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setIsLoading(true); // Set loading to true when starting the API call
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
        setIsSuccess(true); // Set success to true
      } else {
        setMessage('Failed to send contact info. Please try again.');
        setIsSuccess(false); // Set success to false
      }
    } catch (error) {
      console.error('Error sending contact info:', error);
      setMessage('An error occurred. Please try again.');
      setIsSuccess(false); // Set success to false
    } finally {
      setIsLoading(false); // Reset loading status after the API call completes
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
            disabled={isLoading} // Disable input when loading
          />
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
        {isLoading && <p className={styles.loadingMessage}>Sending details, please wait...</p>}
        {message && <p className={isSuccess ? styles.successMessage : styles.errorMessage}>{message}</p>}
      </div>
    </div>
  );
}
