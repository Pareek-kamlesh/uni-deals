// src/components/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { username } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!username) {
        router.push('/login');
      }
    }, [username, router]);

    if (!username) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;