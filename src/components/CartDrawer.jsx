import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import './CartDrawer.css';

const FREE_SHIPPING_THRESHOLD = 2000; // As per the announcement bar text

const CartDrawer = ({ isOpen, onClose, cartItems, setCartItems }) => {
  const navigate = useNavigate();

  // Subtotal Calculation
  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercentage = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Automatically save to local storage on cart change
  useEffect(() => {
    localStorage.setItem('elveracart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (id, size, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.size === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const formattedSubtotal = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(subtotal);

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-drawer-overlay" onClick={onClose} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart-btn" onClick={onClose}><X size={24} /></button>
        </div>

        {/* Free Shipping Progress */}
        {cartItems.length > 0 && (
          <div className="free-shipping-tracker">
            {remainingForFreeShipping > 0 ? (
              <p>You're <strong>₹{remainingForFreeShipping}</strong> away from free shipping!</p>
            ) : (
              <p><strong>Congratulations!</strong> You get free shipping.</p>
            )}
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progressPercentage}%`, backgroundColor: remainingForFreeShipping === 0 ? '#4caf50' : '#1a1a1a' }}
              />
            </div>
          </div>
        )}

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart-message">
              <p>Your cart is empty.</p>
              <button className="btn-continue" onClick={() => { onClose(); navigate('/collections/all'); }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {cartItems.map((item, index) => (
                <li key={`${item.id}-${item.size}-${index}`} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.title}</h3>
                    <p className="cart-item-size">Size: {item.size}</p>
                    <p className="cart-item-price">₹{item.price}</p>
                    
                    <div className="cart-item-actions">
                      <div className="qty-controls">
                        <button onClick={() => updateQuantity(item.id, item.size, -1)}><Minus size={16}/></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, 1)}><Plus size={16}/></button>
                      </div>
                      <button className="remove-item-btn" onClick={() => removeItem(item.id, item.size)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>{formattedSubtotal}</span>
            </div>
            <p className="cart-taxes-note">Taxes included. Discounts applied at checkout.</p>
            <button 
              className="btn-checkout"
              onClick={() => { onClose(); navigate('/checkout'); }}
            >
              Secure Checkout
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default CartDrawer;
