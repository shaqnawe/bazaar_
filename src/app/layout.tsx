import { UserProvider } from '../app/context/AuthContext';
import { CartProvider } from './context/cartContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import './styles/globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Provides global user state */}
        <UserProvider>
          {/* Provides global cart state */}
          <CartProvider>
            <Navbar />
            <main className="content">{children}</main>
            <Footer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
