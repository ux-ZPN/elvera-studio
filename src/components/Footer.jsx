import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container container">
        <div className="footer-grid">
          
          <div className="footer-brand-col">
            <h2 className="footer-brand">ELVÉRA STUDIO</h2>
            <p className="footer-tagline">Made to be kept.</p>
            <div className="footer-socials">
              <a href="https://instagram.com/elverastudio.in" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://facebook.com/elverastudio.in" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="mailto:info@elverastudio.in" aria-label="Email">
                <Mail size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-links">
              <li><Link to="/collections/all">All Products</Link></li>
              <li><Link to="/collections/new">New Arrivals</Link></li>
              <li><Link to="/collections">Collections</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Info</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/shipping">Shipping Policy</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/refund">Refund Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} ELVÉRA STUDIO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
