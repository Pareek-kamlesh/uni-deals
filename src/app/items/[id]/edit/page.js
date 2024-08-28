"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../../../../styles/UpdateItemPage.module.css';

export default function EditItemPage() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [sellerPhoneNumber, setSellerPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      // Fetch item details
      fetch(`/api/items/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setItemName(data.itemName);
          setDescription(data.description);
          setPrice(data.price);
          setImage(data.image);
          setSellerPhoneNumber(data.sellerPhoneNumber);
        })
        .catch((error) => console.error('Failed to fetch item details:', error));
    }
  }, [id, router]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/items/${id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemName, description, price, image, sellerPhoneNumber }),
      });

      if (res.ok) {
        setMessage('Item updated successfully.');
        router.push('/profile');
      } else {
        setMessage('Failed to update item. Please try again.');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.head}>Edit Item</h2>
      <form onSubmit={handleUpdateSubmit}>
        <input 
          type="text" 
          placeholder="Item Name" 
          value={itemName} 
          onChange={(e) => setItemName(e.target.value)} 
          required 
          className={styles.inputField}
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
          className={styles.textareaField}
        />
        <input 
          type="number" 
          placeholder="Price" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          required 
          className={styles.inputField}
        />
        <input 
          type="text" 
          placeholder="Image URL" 
          value={image} 
          onChange={(e) => setImage(e.target.value)} 
          required 
          className={styles.inputField}
        />
        <input 
          type="text" 
          placeholder="Seller Phone Number" 
          value={sellerPhoneNumber} 
          onChange={(e) => setSellerPhoneNumber(e.target.value)} 
          required 
          className={styles.inputField}
        />
        <div className={styles.buttonContainer}>
        <button type="submit" className={styles.submitButton}>Update</button>
        {message && <p className={styles.message}>{message}</p>}
        <button onClick={() => router.push('/profile')} className={styles.cancelButton}>Cancel</button>
        </div>
      </form>
      
    </div>
  );
}
