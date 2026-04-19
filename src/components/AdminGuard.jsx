import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const AdminGuard = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error || !profile?.is_admin) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch (err) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Verifying Identity...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminGuard;
