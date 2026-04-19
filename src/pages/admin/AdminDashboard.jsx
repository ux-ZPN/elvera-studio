import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ todayOrders: 0, monthlyRevenue: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simple aggregate logic: fetch all, parse logically (not huge datasets expected)
        const { data: orders, error } = await supabase.from('orders').select('*');
        if (error) throw error;
        
        let todayCount = 0;
        let pendingCount = 0;
        let mthRev = 0;
        
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        orders?.forEach(order => {
          const t = new Date(order.created_at).getTime();
          
          if (t >= startOfDay) todayCount++;
          if (t >= startOfMonth && order.status !== 'cancelled') mthRev += Number(order.total_amount || 0);
          if (order.status?.toLowerCase() === 'pending') pendingCount++;
        });

        setStats({ todayOrders: todayCount, monthlyRevenue: mthRev, pendingOrders: pendingCount });
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="admin-loader">Loading Dashboard...</div>;

  return (
    <div className="admin-layout animate-fade-in">
      <div className="admin-sidebar">
        <h2>ELVÉRA ADMIN</h2>
        <nav>
          <Link to="/admin/dashboard" className="active">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders">Orders</Link>
        </nav>
      </div>
      
      <div className="admin-content">
        <h1>Dashboard</h1>
        <div className="admin-kpi-grid">
          <div className="kpi-card">
            <h3>Today's Orders</h3>
            <p className="kpi-val">{stats.todayOrders}</p>
          </div>
          <div className="kpi-card">
            <h3>Monthly Revenue</h3>
            <p className="kpi-val">₹{stats.monthlyRevenue}</p>
          </div>
          <div className="kpi-card">
            <h3>Pending Orders</h3>
            <p className="kpi-val">{stats.pendingOrders}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
