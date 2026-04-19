import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Package } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import CartDrawer from './CartDrawer';
import AuthModal from './AuthModal';
import { supabase } from '../services/supabaseClient';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 2. Cart Listener
    const updateCartCount = () => {
      const cartStr = localStorage.getItem('elveracart') || '[]';
      setCartItems(prev => {
        const prevStr = JSON.stringify(prev);
        if (prevStr !== cartStr) {
          return JSON.parse(cartStr);
        }
        return prev;
      });
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const intervalId = setInterval(updateCartCount, 1000); 

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', updateCartCount);
      clearInterval(intervalId);
      subscription.unsubscribe();
    };
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleUserIconClick = () => {
    if (session) {
      navigate('/account');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="announcement-wrapper">
        <AnnouncementBar />
      </div>

      <nav className="navbar-container container">
        {/* Left Header - Logo */}
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <img 
              src="/assets/logo.jpg" 
              alt="Elvera Studio" 
              className="navbar-logo"
            />
          </Link>
        </div>
        
        {/* Center Header - Navigation Links */}
        <div className="navbar-center hidden-mobile">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/collections" className="nav-link">Collections</Link>
            </li>

            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Right Header - Icons */}
        <div className="navbar-right">
          <div className="navbar-icons">
            <button className="icon-btn" aria-label="Track Guest Order" onClick={() => navigate('/track-order')} title="Track Order">
              <Package size={22} strokeWidth={1.5} />
            </button>
            <button className="icon-btn" aria-label="User account" onClick={handleUserIconClick}>
              <User size={24} strokeWidth={1.5} />
            </button>
            <button className="icon-btn cart-btn" aria-label="Shopping bag" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={24} strokeWidth={1.5} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button className="icon-btn mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Menu">
              {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav">
          <li className="mobile-nav-item">
            <Link to="/" onClick={toggleMobileMenu}>Home</Link>
          </li>
          <li className="mobile-nav-item">
            <Link to="/collections" onClick={toggleMobileMenu}>Collections</Link>
          </li>

          <li className="mobile-nav-item">
            <Link to="/contact" onClick={toggleMobileMenu}>Contact</Link>
          </li>
          <li className="mobile-nav-item">
            <Link to="/about" onClick={toggleMobileMenu}>About Us</Link>
          </li>
        </ul>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        setCartItems={setCartItems} 
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;
