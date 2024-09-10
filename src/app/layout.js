// src/app/layout.js
import ClientLayout from '../../components/ClientLayout';
import Header from '../../components/Header';
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider
import '../../styles/globals.css';

export const metadata = {
  title: 'Uni-deals',
  description: 'A solution to newcomers and old students of any university',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> {/* Wrap the whole application in AuthProvider */}
          <ClientLayout>
            <Header />
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}