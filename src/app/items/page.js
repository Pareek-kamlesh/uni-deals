'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/ItemsPage.module.css';

// Function to format the date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ItemsPage({ searchQuery }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('global');
  const [cities, setCities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const router = useRouter();
  const containerRef = useRef(null); // Create a ref for the container

  useEffect(() => {
    async function fetchItems() {
      let url = '/api/items';
      if (selectedCity) url += `?city=${selectedCity}`;
      if (selectedCollege) url += `&college=${selectedCollege}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        console.error('Failed to fetch items');
      }
    }

    fetchItems();

    // Restore scroll position
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      containerRef.current.scrollTo(0, parseInt(savedScrollPosition, 10));
    }
  }, [selectedCity, selectedCollege]);

  useEffect(() => {
    async function fetchCitiesAndColleges() {
      const res = await fetch('/api/user-data'); // Fetch user data from the new API route
      if (res.ok) {
        const data = await res.json();
        setCities([...new Set(data.map(user => user.city))]);
        setColleges(data);
      } else {
        console.error('Failed to fetch cities and colleges');
      }
    }

    fetchCitiesAndColleges();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      const filtered = colleges
        .filter(college => college.city === selectedCity)
        .map(college => college.college);
      setFilteredColleges([...new Set(filtered)]); // Remove duplicates
      setSelectedCollege(''); // Reset selected college when city changes
    } else {
      setFilteredColleges([]);
    }
  }, [selectedCity, colleges]);

  const handleItemClick = (itemId) => {
    // Save scroll position
    sessionStorage.setItem('scrollPosition', containerRef.current.scrollTop);
    router.push(`/items/${itemId}`);
  };

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.filters}>
        <label className={styles.filterLabel}>
          <input
            type="radio"
            value="global"
            checked={filter === 'global'}
            onChange={() => {
              setFilter('global');
              setSelectedCity('');
              setSelectedCollege('');
            }}
            className={styles.filterInput}
          />
          Global
        </label>
        <label className={styles.filterLabel}>
          <input
            type="radio"
            value="city"
            checked={filter === 'city'}
            onChange={() => setFilter('city')}
            className={styles.filterInput}
          />
          City
        </label>
        {filter === 'city' && (
          <select
            onChange={(e) => setSelectedCity(e.target.value)}
            value={selectedCity}
            className={styles.filterSelect}
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        )}
        {selectedCity && (
          <label className={styles.filterLabel}>
            <input
              type="radio"
              value="college"
              checked={filter === 'college'}
              onChange={() => setFilter('college')}
              className={styles.filterInput}
            />
            College
          </label>
        )}
        {filter === 'college' && selectedCity && (
          <select
            onChange={(e) => setSelectedCollege(e.target.value)}
            value={selectedCollege}
            className={styles.filterSelect}
          >
            <option value="">Select College</option>
            {filteredColleges.map(college => (
              <option key={college} value={college}>{college}</option>
            ))}
          </select>
        )}
      </div>
      <div className={styles.itemGrid}>
        {filteredItems.map(item => (
          <div key={item._id} className={styles.itemCard}>
            <div className={styles.imageContainer}>
              <img
                src={item.image}
                alt={item.itemName}
                className={styles.itemImage}
                onClick={() => window.open(item.image, '_blank')}
                onLoad={() => console.log('Image loaded:', item.image)}
                onError={(e) => {
                  e.target.style.display = 'none'; // Hide broken image
                  const errorMessage = document.createElement('div');
                  errorMessage.className = styles.imageErrorMessage;
                  errorMessage.innerHTML = `
                    <div style="text-align: center;">
                      <img src="/uploads/error-icon.png" alt="Error" style="width: 30px;" />
                      <p>Please click here to see the image</p>
                    </div>
                  `;
                  errorMessage.onclick = () => window.open(item.image, '_blank');
                  e.target.parentNode.appendChild(errorMessage); // Append error message in the same container
                }}
              />
            </div>

            <h3 className={styles.itemName}>{item.itemName}</h3>
            <p className={styles.itemDescription}>{item.description}</p>
            <p className={styles.itemPrice}>Rs. {item.price}</p>
            <p className={styles.postedDate}>Posted on: {formatDate(item.postedDate)}</p>
            <button 
              onClick={() => handleItemClick(item._id)} 
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