'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear the token from local storage
    localStorage.removeItem('token');

    // Redirect to the login page or home page
    router.push('/login');
  }, [router]);

  return <p>Logging out...</p>;
}
