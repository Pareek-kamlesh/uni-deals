'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../../../../styles/UpdateItemPage.module.css';
import { showToast } from '../../../../../lib/toast'; // Import your showToast function
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function EditItemPage() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null); // Handle new image file
  const [sellerPhoneNumber, setSellerPhoneNumber] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // Store current image URL
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
          setCurrentImageUrl(data.image); // Set current image URL
          setSellerPhoneNumber(data.sellerPhoneNumber);
        })
        .catch((error) => {
          console.error('Failed to fetch item details:', error);
          showToast('error', 'Failed to fetch item details. Please try again.');
        });
    }
  }, [id, router]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('error', 'You must be logged in to update an item.');
      return;
    }
  
    let uploadedImageUrl = currentImageUrl; // Default to the current image URL
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
        showToast('error', 'Failed to upload image. Please try again.');
        return;
      }
    }
  
    // Send updated item details to your backend
    try {
      const res = await fetch(`/api/items/${id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName,
          description,
          price,
          image: uploadedImageUrl, // Updated or current image URL
          sellerPhoneNumber,
        }),
      });
  
      if (res.ok) {
        showToast('success', 'Item updated successfully.');
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        const errorData = await res.json();
        showToast('error', errorData.message || 'Failed to update item. Please try again.');
      }
    } catch (error) {
      console.error('Error updating item:', error.message);
      showToast('error', 'An error occurred. Please try again.');
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
        <div className={styles.imageInputContainer}>
          <span>Current Image:</span>
          <img src={currentImageUrl} alt="Current Item" className={styles.imagePreview} />
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImageFile(e.target.files[0])} 
            className={styles.inputField}
          />
        </div>
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
          <button onClick={() => router.push('/profile')} className={styles.cancelButton}>Cancel</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
