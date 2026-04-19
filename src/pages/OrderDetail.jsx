import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import './Account.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data: orderData, error: dbError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();

        if (dbError || !orderData) {
          setError('Order not found.');
        } else {
          setOrder(orderData);
        }
      } catch (err) {
        setError('Error fetching order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="account-loader">Loading details...</div>;
  if (error || !order) return <div className="account-page container"><h2>{error}</h2><button onClick={() => navigate(-1)} className="btn-logout">Go Back</button></div>;

  return (
    <div className="account-page container animate-fade-in">
      <div className="account-header">
        <h1>Order #{order.id.slice(0, 8)}</h1>
        <p>Placed on {new Date(order.created_at).toLocaleDateString()}</p>
        <span className={`status-badge ${order.status?.toLowerCase()}`}>{order.status}</span>
      </div>

      <div className="order-grid" style={{ display: 'grid', gridTemplateColumns: 'revert', gap: '2rem' }}>
        <div className="order-items">
          <h2>Items</h2>
          {/* Note: JSON array mapping based on cartItems format stored securely */}
          {(order.items || []).map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #eaeaea', padding: '1rem 0' }}>
              <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
              <div>
                <p style={{ margin: '0 0 5px 0', fontWeight: '500' }}>{item.title}</p>
                <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>Size: {item.size} • Qty: {item.quantity}</p>
                <p style={{ margin: '5px 0 0 0' }}>₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="order-meta" style={{ background: '#fafafa', padding: '2rem' }}>
          <h3>Order Summary</h3>
          <p>Total: <strong>₹{order.total_amount}</strong></p>
          <hr style={{ borderTop: '1px solid #eaeaea', borderBottom: 'none', margin: '1.5rem 0' }} />
          <h3>Shipping Timeline</h3>
          <p>{order.tracking_number ? `Tracking ID: ${order.tracking_number}` : 'Awaiting fulfillment.'}</p>
          <p>Standard Delivery (3-5 Business Days)</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
