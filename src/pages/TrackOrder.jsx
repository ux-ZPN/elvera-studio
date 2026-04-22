import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Search } from 'lucide-react';
import './TrackOrder.css';

const TrackOrder = () => {
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrderData(null);

    // Clean prefixes like ELV- or # if user typed them
    const cleanId = orderId.replace(/^ELV-?/i, '').replace('#', '').trim();

    try {
      // We call our secure database function instead of querying the table directly
      const { data, error: dbError } = await supabase
        .rpc('track_order', { 
          input_email: email.trim(), 
          input_id_prefix: cleanId 
        });
        
      // RPC returns an array, so we look for the first match
      if (dbError || !data || data.length === 0) {
        setError("We couldn't find an order matching that Email and Order ID combination.");
      } else {
        setOrderData(data[0]);
      }
    } catch (err) {
      setError("An error occurred while tracking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-order-page container animate-fade-in">
      <div className="track-header">
        <h1>Track Your Order</h1>
        <p>Enter your email and order ID to check the real-time status of your shipment.</p>
      </div>

      <div className="track-form-container">
        <form onSubmit={handleTrack} className="track-form">
          <input 
            type="email" 
            id="track-email"
            name="email"
            placeholder="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            id="track-order-id"
            name="orderId"
            placeholder="Order ID (e.g. ELV-1234)" 
            value={orderId} 
            onChange={e => setOrderId(e.target.value)} 
            required 
          />
          <button type="submit" disabled={loading} className="btn-track">
            {loading ? 'Searching...' : <><Search size={18} /> Track Order</>}
          </button>
        </form>

        {error && <div className="track-error">{error}</div>}
      </div>

      {orderData && (
        <div className="track-result animate-fadeIn">
          <div className="result-header">
            <h2>Order Found</h2>
            <span className={`status-badge ${orderData.status.toLowerCase()}`}>
              {orderData.status}
            </span>
          </div>
          
          <div className="result-details">
            <div className="detail-col">
              <strong>Order Date</strong>
              <p>{new Date(orderData.created_at).toLocaleDateString()}</p>
            </div>
            <div className="detail-col">
              <strong>Total</strong>
              <p>₹{orderData.total_amount}</p>
            </div>
            <div className="detail-col">
              <strong>Tracking ID</strong>
              <p>{orderData.tracking_number || 'Awaiting dispatch'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
