'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Spinner from './Spinner'; // Import Spinner component

export default function ClientLayout({ children }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Show loading spinner on pathname change
    setLoading(true);

    // Mock loading delay
    const timer = setTimeout(() => {
      setLoading(false); // Hide spinner after delay
    }, 500); // Adjust time as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [pathname]); // Depend on pathname changes

  return (
    <>
      {loading && <Spinner />} {/* Show spinner if loading */}
      {children}
    </>
  );
}
