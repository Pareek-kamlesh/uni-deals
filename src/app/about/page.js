// src/app/About/page.js
import styles from '../../../styles/About.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>About Uni-Deals</h1>
      <p className={styles.p}>Welcome to Uni-Deals! This website is designed to help university students to buy or sell their products easily and seamlessly on this platform.</p>
      
      <h2 className={styles.h2}>Why Uni-Deals?</h2>
      <p className={styles.p}>University students often struggle to find affordable products and services. Our goal is to provide a centralized platform where students can easily find the best deals available.</p>
      
      <h2 className={styles.h2}>Working Mechanisms</h2>
      <p className={styles.p}>Our website aggregates deals from multiple sources and presents them in an easy-to-navigate format. Users can search for deals, filter them by category, and can can also sell their items through it.</p>
      
      <h2 className={styles.h2}>How to Use Uni-Deals</h2>
      <ol className={styles.ol}>
      <li className={styles.li}>Browse Deals: Navigate to the &apos;Deals&apos; section to browse the latest deals.</li>
      <li className={styles.li}>Change Password: Navigate to &apos;Profile Section&apos; to change your password.</li>
      <li className={styles.li}>Your item: Navigate to profile section on the top right corner and then visit your profile section. There you will get your page where your uploaded items will be visible.</li>
      <li className={styles.li}>Sell item: Navigate to profile and click on the add item button. Now you will be directed to a form where you can add the item. Be careful with the instructions for every fill up.</li>

        <li className={styles.li}>Your item: Navigate to profile section on top right corner and then visit your profile section. There you will get your page where your uploaded items will be visible.</li>
        <li className={styles.li}>Sell item: Navigate to profile and click on add item button, Now you will bw directed to a form where you can add the item. Be careful with the instructions for every fill up.</li>
      </ol>
      
      <h2 className={styles.h2}>Solution</h2>
      <p className={styles.p}>By aggregating deals from various sources and providing powerful search and filter options, Uni-Deals makes it easy for students to find the best deals quickly and efficiently.</p>
      
      <p className={styles.p}>
        Learn more on our <a href="/more-info" className={styles.link}>More Info</a> page.
      </p>
    </div>
  );
}