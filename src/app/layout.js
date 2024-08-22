import Header from '../../components/Header';
import '../../styles/globals.css'
export const metadata = {
  title: 'Uni-deals',
  description: 'A solution to newcomers and old students of any university',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Header />
      <body>
        
        {children}
      </body>
    </html>
  );
}
