// src/components/withAuth.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'src/context/AuthContext';

const withAuth = (WrappedComponent) => {
  const WithAuthComponent = (props) => {
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

  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;