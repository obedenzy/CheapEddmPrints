import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { cartItems, toggleCart } = useCart();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <span className="text-primary text-2xl font-bold">CheapEDDM<span className="text-secondary">Fast</span></span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`font-medium hover:text-primary ${location === '/' ? 'text-primary' : ''}`}>
              Home
            </Link>
            <Link href="/shop" className={`font-medium hover:text-primary ${location === '/shop' ? 'text-primary' : ''}`}>
              Shop
            </Link>
            <Link href="/contact" className={`font-medium hover:text-primary ${location === '/contact' ? 'text-primary' : ''}`}>
              Contact
            </Link>
            {user ? (
              <Link href="/profile" className={`font-medium hover:text-primary ${location === '/profile' ? 'text-primary' : ''}`}>
                My Account
              </Link>
            ) : (
              <Link href="/login" className={`font-medium hover:text-primary ${location === '/login' ? 'text-primary' : ''}`}>
                Login
              </Link>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleCart}
              className="relative p-2"
              aria-label="Cart"
            >
              <i className="fas fa-shopping-cart text-gray-700"></i>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button 
              onClick={toggleMobileMenu}
              className="p-2"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-gray-700`}></i>
            </button>
          </div>
          
          {/* Cart Icon (Desktop) */}
          <div className="hidden md:block">
            <button 
              onClick={toggleCart}
              className="relative p-2"
              aria-label="Cart"
            >
              <i className="fas fa-shopping-cart text-gray-700"></i>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/" onClick={closeMobileMenu} className="py-2 font-medium hover:text-primary">
                Home
              </Link>
              <Link href="/shop" onClick={closeMobileMenu} className="py-2 font-medium hover:text-primary">
                Shop
              </Link>
              <Link href="/contact" onClick={closeMobileMenu} className="py-2 font-medium hover:text-primary">
                Contact
              </Link>
              {user ? (
                <>
                  <Link href="/profile" onClick={closeMobileMenu} className="py-2 font-medium hover:text-primary">
                    My Account
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }} 
                    className="py-2 text-left font-medium text-red-500 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={closeMobileMenu} className="py-2 font-medium hover:text-primary">
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
