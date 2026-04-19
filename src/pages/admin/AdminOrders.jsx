import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Link } from 'react-router-dom';
import './Admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') {
      query = query.eq('status', filter);
    }
    const { data } = await query;
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const updateStatus = async (id, newStatus) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    fetchOrders();
  };

  const updateTracking = async (id) => {
    const trackingNo = prompt('Enter tracking number/ID:');
    if (trackingNo !== null) {
      await supabase.from('orders').update({ tracking_number: trackingNo }).eq('id', id);
      fetchOrders();
    }
  };

  return (
    <div className="admin-layout animate-fade-in">
      <div className="admin-sidebar">
        <h2>ELVÉRA ADMIN</h2>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders" className="active">Orders</Link>
        </nav>
      </div>

      <div className="admin-content">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Orders Manager</h1>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="admin-filter">
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {loading ? <div className="admin-loader">Loading orders...</div> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Email</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Tracking</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id.slice(0, 8)}</td>
                  <td>{o.email}</td>
                  <td>₹{o.total_amount}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>
                    <select 
                      value={o.status || 'pending'} 
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="admin-status-dropdown"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    {o.tracking_number ? (
                      <div style={{fontSize:'0.8rem'}}>{o.tracking_number} 
                       <br/><button className="admin-track-btn" onClick={() => updateTracking(o.id)}>Edit</button>
                      </div>
                    ) : (
                      <button className="admin-track-btn" onClick={() => updateTracking(o.id)}>+ Add ID</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
