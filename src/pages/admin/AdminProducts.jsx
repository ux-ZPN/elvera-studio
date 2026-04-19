import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import imageCompression from 'browser-image-compression';
import { Link } from 'react-router-dom';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products
  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('id', { ascending: true });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    await supabase.from('products').update({ available: !currentStatus }).eq('id', id);
    fetchProducts();
  };

  const handleImageUpload = async (e, productId) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // 1. Compress Image natively on frontend thread to save bandwidth/storage entirely
      const options = { maxSizeMB: 0.3, fileType: 'image/webp', useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      const fileName = `${Date.now()}-${file.name.split('.')[0]}.webp`;
      
      // 2. Upload cleanly to products bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName);
      const publicURL = publicUrlData.publicUrl;

      // 3. Update the specific product image locally (assuming appending new image to array if possible, or replacing the first index)
      // Since `images` is a JSONB array, we must fetch current to modify it safely.
      const currentImages = products.find(p => p.id === productId)?.images || [];
      const newImageBlock = { src: publicURL, alt: 'Updated via Admin' };
      const updatedImages = [newImageBlock, ...currentImages];

      await supabase.from('products').update({ images: updatedImages }).eq('id', productId);
      
      alert('Success! Image compressed and uploaded as WebP.');
      fetchProducts();
      
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + err.message);
    }
  };

  if (loading) return <div className="admin-loader">Loading products...</div>;

  return (
    <div className="admin-layout animate-fade-in">
      <div className="admin-sidebar">
        <h2>ELVÉRA ADMIN</h2>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/products" className="active">Products</Link>
          <Link to="/admin/orders">Orders</Link>
        </nav>
      </div>

      <div className="admin-content">
        <h1>Product Manager</h1>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Status</th>
              <th>Quick Actions</th>
              <th>Upload Asset</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id.toString().slice(0,6)}...</td>
                <td>
                  {p.images?.[0] ? <img src={p.images[0].src} alt="" width="40" height="40" style={{objectFit:'cover'}}/> : 'N/A'}
                </td>
                <td>{p.title}</td>
                <td>
                  <span className={`status-badge ${p.available ? 'paid' : 'pending'}`}>
                    {p.available ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="admin-btn-small" onClick={() => toggleStatus(p.id, p.available)}>
                    Toggle Visibility
                  </button>
                </td>
                <td>
                  <label className="admin-upload-btn">
                    Upload WebP
                    <input type="file" accept="image/*" style={{display: 'none'}} onChange={(e) => handleImageUpload(e, p.id)} />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
