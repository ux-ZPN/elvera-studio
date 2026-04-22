import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Star } from 'lucide-react';
import AddReviewModal from '../components/AddReviewModal';
import './Account.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUserSession(session);

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
    fetchData();
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
            <div key={i} style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #eaeaea', padding: '1.5rem 0', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <img src={item.image} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>{item.title}</p>
                  <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>Size: {item.size} • Qty: {item.quantity}</p>
                  <p style={{ margin: '5px 0 0 0', fontWeight: '500' }}>₹{item.price}</p>
                </div>
              </div>
              {order.status?.toLowerCase() === 'delivered' && (
                <button 
                  onClick={() => {
                    setSelectedItem(item);
                    setIsReviewModalOpen(true);
                  }}
                  className="rate-item-btn"
                >
                  <Star size={14} /> Rate & Review
                </button>
              )}
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

      {selectedItem && (
        <AddReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productHandle={selectedItem.handle || selectedItem.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')}
          productTitle={selectedItem.title}
          userSession={userSession}
          isVerified={true}
        />
      )}
    </div>
  );
};

export default OrderDetail;
