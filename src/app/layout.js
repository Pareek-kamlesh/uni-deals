// src/app/layout.js
import ClientLayout from '../../components/ClientLayout'; // Import the new client layout component
import Header from '../../components/Header'; // Keep Header here as it will be managed by ClientLayout
import '../../styles/globals.css'; // Import global styles

export const metadata = {
  title: 'Uni-deals',
  description: 'A solution to newcomers and old students of any university',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          <Header /> {/* Header is managed in ClientLayout */}
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
