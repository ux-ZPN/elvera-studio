import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import ProductCard from '../components/ProductCard';
import './Catalog.css';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
          
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching catalog:", err);
        setError('Failed to load catalog. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="catalog-container animate-fade-in">
      <div className="catalog-header container">
        <h1 className="catalog-title">Products</h1>
      </div>

      <div className="catalog-content container">
        {loading ? (
          <div className="catalog-grid">
            {[1, 2, 3, 4].map(id => (
              <div key={id} className="product-card-placeholder">
                <div className="image-placeholder"></div>
                <div className="details-placeholder">
                  <span className="title-placeholder"></span>
                  <span className="price-placeholder"></span>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="catalog-error">
            <p>{error}</p>
          </div>
        ) : (
          <div className="catalog-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
