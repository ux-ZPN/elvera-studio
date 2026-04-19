import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TrustBadges from '../components/TrustBadges';
import BrandStory from '../components/BrandStory';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formatting helper for prices
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://elverastudio.in/products.json?limit=4');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        // Grab exactly 4 products for the bento grid
        setFeaturedProducts(data.products ? data.products.slice(0, 4) : []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container animate-fade-in">
      {/* Stitch-style Cinematic Hero */}
      <section className="hero">
        <div 
          className="hero-background" 
          style={{ backgroundImage: `url('https://www.instagram.com/p/DXCWLt4j3jR/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==')` }}
        ></div>
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <span className="hero-subtitle">The Premiere Exhibition</span>
          <h1 className="hero-title">The Debut<br/>Collection</h1>
          <button 
            className="btn-editorial" 
            onClick={() => navigate('/collections/all')}
          >
            Explore Archive
          </button>
        </div>
      </section>

      <TrustBadges />
      
      {/* Stitch-style Bento Grid using Vanilla CSS */}
      <section className="featured">
        <div className="section-header-row">
          <div>
            <span className="featured-label">Curated Series</span>
            <h2 className="featured-heading">The Essential Edit</h2>
          </div>
          <Link to="/collections/all" className="shop-all-link">Shop All Pieces</Link>
        </div>
        
        <div className="bento-container">
          {loading ? (
            <div className="bento-grid">
              <div className="bento-large bento-skeleton rounded-sm"></div>
              <div className="bento-medium bento-skeleton rounded-sm"></div>
              <div className="bento-small bento-skeleton rounded-sm"></div>
              <div className="bento-small bento-skeleton rounded-sm"></div>
            </div>
          ) : (
            <div className="bento-grid">
              {featuredProducts.map((product, index) => {
                // Determine styling based on index to create the asymmetrical 'stitch' layout
                let bentoClass = "bento-small";
                if (index === 0) bentoClass = "bento-large";
                else if (index === 1) bentoClass = "bento-medium";
                
                const imageSrc = product.images && product.images.length > 0 ? product.images[0].src : '';
                const price = product.variants && product.variants.length > 0 ? product.variants[0].price : 0;
                
                return (
                  <Link to={`/product/${product.handle}`} key={product.id} className={`bento-item ${bentoClass}`}>
                    {imageSrc && (
                      <img src={imageSrc} alt={product.title} className="bento-image" loading="lazy" />
                    )}
                    <div className="bento-overlay"></div>
                    <div className="bento-content">
                      <span className="bento-category">{product.product_type || 'Selected Piece'}</span>
                      <h3 className="bento-title">{product.title}</h3>
                      {index === 0 ? (
                        <div>
                           <span className="bento-price">{formatPrice(price)}</span>
                           <br/>
                           <span className="bento-preorder">Available Now</span>
                        </div>
                      ) : (
                        <span className="bento-price">{formatPrice(price)}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      
      <BrandStory />
    </div>
  );
};

export default Home;
