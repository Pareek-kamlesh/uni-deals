'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/AddItem.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../../../lib/toast';
import withAuth from '../../../components/withAuth';

function AddItem() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [sellerPhoneNumber, setSellerPhoneNumber] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('error', 'You must be logged in to add an item.');
      return;
    }
  
    let uploadedImageUrl = '';
    if (imageFile) {
      try {
        // Get the signature and other Cloudinary parameters from the backend
        const signatureRes = await fetch('/api/upload-signature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folder: 'items' }),
        });
  
        if (!signatureRes.ok) {
          throw new Error('Failed to get signature from backend');
        }
  
        const { signature, timestamp, folder, cloud_name, api_key } = await signatureRes.json();
  
        // Upload the image to Cloudinary
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);
        formData.append('api_key', api_key);
  
        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
  
        const cloudinaryData = await cloudinaryRes.json();
        if (cloudinaryData.secure_url) {
          uploadedImageUrl = cloudinaryData.secure_url;
        } else {
          throw new Error(cloudinaryData.error?.message || 'Image upload failed');
        }
      } catch (error) {
        console.error('Image Upload Error:', error.message);
        showToast('error', 'Image upload failed. Please try again.');
        return;
      }
    }
  
    // Send item details to your backend
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        itemName,
        description,
        price,
        image: uploadedImageUrl,
        sellerPhoneNumber,
      }),
    });
  
    if (res.ok) {
      showToast('success', 'Item added successfully!');
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } else {
      const errorData = await res.json();
      showToast('error', errorData.message || 'Failed to add item. Please try again.');
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
          <span className={styles.labelText}>Image:</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>Phone Number:</span>
          <input
            type="text"
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
      <ToastContainer />
    </div>
  );
}

export default withAuth(AddItem);
