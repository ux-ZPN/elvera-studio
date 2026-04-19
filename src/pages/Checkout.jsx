import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import AuthModal from '../components/AuthModal';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    email: '', phone: '', firstName: '', lastName: '',
    address: '', apartment: '', city: '', state: '', pincode: '',
    createAccount: false,
    paymentMethod: 'rpy_or_cod'
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [session, setSession] = useState(null);

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const cart = JSON.parse(localStorage.getItem('elveracart') || '[]');
    setCartItems(cart);

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (!session) {
        setIsAuthModalOpen(true);
      } else {
        // Auto-fill email if possible
        setFormData(prev => ({ ...prev, email: session.user.email || '' }));
      }
    };
    checkSession();
  }, [navigate]);

  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    // Strip symbols like ₹, $, and commas, but keep decimal point
    const cleanPrice = String(price).replace(/[₹$,]/g, '');
    return parseFloat(cleanPrice) || 0;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (parsePrice(item.price) * item.quantity), 0);
  const finalTotal = subtotal - discount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    // Temporary client-side mock logic: In production, call Edge Function
    if (coupon.toUpperCase() === 'FIRST450' && subtotal >= 2349) {
      setDiscount(450);
      alert('Coupon Applied');
    } else if (coupon.toUpperCase() === 'SEVEN200') {
      setDiscount(200);
      alert('Coupon Applied');
    } else {
      alert('Invalid or inapplicable coupon code.');
      setDiscount(0);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.firstName || !formData.address || !formData.pincode || !formData.email) {
      alert('Please fill out all required shipping fields including Email.');
      return;
    }

    if (formData.paymentMethod === 'cod') {
      try {
        // Submit real order to Backend
        const { error } = await supabase
          .from('orders')
          .insert([{
             email: formData.email,
             total_amount: finalTotal,
             status: 'processing'
          }]);
          
        if (error) {
           console.error("Supabase Error Object:", error);
           throw new Error(error.message || JSON.stringify(error));
        }

        // Process COD Order locally, then clear cart
        localStorage.removeItem('elveracart');
        alert('Order placed successfully using COD!');
        navigate('/account');
      } catch (err) {
        console.error("Order submission error:", err);
        alert(`Order Failed: ${err.message || 'Unknown database error'}. Please check console.`);
      }
    } else {
      // Razorpay logic placeholder
      alert('Razorpay integration pending Edge Functions setup.');
    }
  };

  const formatPrice = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.max(0, val));

  return (
    <div className="checkout-page animate-fade-in">
      <div className="container checkout-container">
        
        {/* Left Column - Form */}
        <div className="checkout-form-section">
          <div className="checkout-brand">
            <h1>ELVÉRA STUDIO</h1>
          </div>
          
          <form onSubmit={handlePlaceOrder}>
            
            {/* Contact Info */}
            <div className="form-group-section">
              <h2 className="form-section-title">Contact Information</h2>
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
              <label className="checkbox-label">
                <input type="checkbox" name="createAccount" checked={formData.createAccount} onChange={handleChange} />
                Save this information for next time (Create Account)
              </label>
            </div>

            {/* Shipping Info */}
            <div className="form-group-section">
              <h2 className="form-section-title">Shipping Address</h2>
              <div className="form-row">
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
              </div>
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
              <input type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" value={formData.apartment} onChange={handleChange} />
              
              <div className="form-row">
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
                <input type="text" name="pincode" placeholder="PIN Code" value={formData.pincode} onChange={handleChange} required />
              </div>
            </div>

            {/* Payment Info */}
            <div className="form-group-section">
              <h2 className="form-section-title">Payment Method</h2>
              <div className="payment-options">
                <label className={`payment-label ${formData.paymentMethod === 'razorpay' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="razorpay" checked={formData.paymentMethod === 'razorpay'} onChange={handleChange} />
                  Razorpay (Cards, UPI, NetBanking)
                </label>
                <label className={`payment-label ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                  Cash on Delivery (COD)
                </label>
              </div>
            </div>

            <button type="submit" className="btn-pay-now">
              {formData.paymentMethod === 'cod' ? 'Complete Order' : 'Pay Now'}
            </button>
            <button type="button" className="btn-return-cart" onClick={() => navigate('/collections/all')}>
              Return to Catalog
            </button>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="checkout-summary-section">
          <div className="summary-items">
            {cartItems.map((item, i) => (
              <div key={i} className="summary-item">
                <div className="summary-item-img-wrapper">
                  <img src={item.image} alt={item.title} />
                  <span className="summary-qty-badge">{item.quantity}</span>
                </div>
                <div className="summary-item-details">
                  <span className="summary-item-title">{item.title}</span>
                  <span className="summary-item-size">{item.size}</span>
                </div>
                <div className="summary-item-price">
                  {formatPrice(parseFloat(item.price) * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="discount-block">
            <form onSubmit={handleApplyCoupon} className="discount-form">
              <input type="text" placeholder="Discount code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <button type="submit" disabled={!coupon}>Apply</button>
            </form>
          </div>

          <div className="summary-totals">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="totals-row discount-row">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="totals-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          
          <div className="totals-row final-total">
            <span>Total</span>
            <span className="final-price">{formatPrice(finalTotal)}</span>
          </div>

        </div>

      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Checkout;
