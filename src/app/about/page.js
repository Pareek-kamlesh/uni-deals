// src/app/About/page.js
import styles from '../../../styles/About.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>About Uni-Deals</h1>
      <p className={styles.p}>Welcome to Uni-Deals! This website is designed to help university students find the best deals on various products and services.</p>
      <h2 className={styles.h2}>Working Mechanisms</h2>
      <p className={styles.p}>Our website aggregates deals from multiple sources and presents them in an easy-to-navigate format. Users can search for deals, filter them by category, and save their favorite deals for later.</p>
      <h2 className={styles.h2}>Problem Statement</h2>
      <p className={styles.p}>University students often struggle to find affordable products and services. Our goal is to provide a centralized platform where students can easily find the best deals available.</p>
      <h2 className={styles.h2}>Solution</h2>
      <p className={styles.p}>By aggregating deals from various sources and providing powerful search and filter options, Uni-Deals makes it easy for students to find the best deals quickly and efficiently.</p>
      <p className={styles.p}>
        Learn more on our <a href="/more-info" className={styles.link}>More Info</a> page.
      </p>
    </div>
  );
}