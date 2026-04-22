import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }
      setUser(session.user);

      // Fetch Orders mapped to this user's email explicitly (case-insensitive)
      const { data: orderData, error } = await supabase
        .from('orders')
        .select('*')
        .ilike('email', session.user.email)
        .order('created_at', { ascending: false });

      if (error) console.error("Error fetching orders:", error);
      if (orderData) {
        setOrders(orderData);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return <div className="account-loader">Loading account...</div>;
  if (!user) return null;

  return (
    <div className="account-page container animate-fade-in">
      <div className="account-header">
        <h1>My Account</h1>
        <p>Logged in as: {user.email}</p>
        <button onClick={handleLogout} className="btn-logout">Sign Out</button>
      </div>

      <div className="account-orders-section">
        <h2>Order History</h2>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/collections/all" className="btn-shop-now">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id.slice(0, 8)}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>₹{order.total_amount}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="order-actions">
                        <Link to={`/account/order/${order.id}`} className="view-order-link">
                          View Details
                        </Link>
                        {order.status.toLowerCase() === 'delivered' && (
                          <Link to={`/account/order/${order.id}?review=true`} className="rate-order-link">
                            Rate Items
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
