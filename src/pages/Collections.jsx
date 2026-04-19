import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Collections.css';

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Exact formatting from the screenshot "Rs. 1,199.00"
  const formatPrice = (price) => {
    return `Rs. ${Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://elverastudio.in/products.json?limit=250');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Grouping logic based on the user's specific sections
  const vol1Products = products.filter(p => p.title.toUpperCase().includes('VOL 01'));
  const edenProducts = products.filter(p => 
    p.title.toUpperCase().includes('ABUNDANCE OF TIME') || 
    p.title.toUpperCase().includes('GARDEN OF PLENTY') ||
    p.title.toUpperCase().includes('MELT OF TIME')
  );
  const formProducts = products.filter(p => 
    p.title.toUpperCase().includes('SWEATPANT') ||
    p.title.toUpperCase().includes('JOGGER')
  );

  return (
    <div className="collections-grouped-page animate-fade-in">
      
      <div className="grouped-container">

        {loading ? (
          <div className="elvera-grid-4">
             {[...Array(8)].map((_, i) => (
                <div key={i} className="elvera-card-skeleton" />
             ))}
          </div>
        ) : (
          <div className="sections-wrapper">
            
            {/* SECTION 1: VOL 01 */}
            {vol1Products.length > 0 && (
              <section className="product-section">
                <div className="section-header-block">
                  <h2 className="section-main-heading">VOL 01</h2>
                  <span className="section-sub-heading">SEVEN SISTERS</span>
                </div>
                
                <div className="elvera-grid-4">
                  {vol1Products.map(product => {
                    const primaryImage = product.images?.[0]?.src;
                    const hoverImage = product.images?.[1]?.src || primaryImage;
                    const price = product.variants?.[0]?.price || 0;
                    return (
                      <div key={product.id} className="elvera-product-card">
                        <Link to={`/product/${product.handle}`} className="elvera-image-box">
                          <img src={primaryImage} alt={product.title} className="image-primary" loading="lazy" />
                          <img src={hoverImage} alt={product.title} className="image-secondary" loading="lazy" />
                        </Link>
                        <div className="elvera-card-content">
                          <h3 className="elvera-card-title">{product.title}</h3>
                          <p className="elvera-card-price">{formatPrice(price)}</p>
                          <Link to={`/product/${product.handle}`} className="elvera-btn-view">
                            View Product
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SECTION 2: ELVÉRA: EDEN */}
            {edenProducts.length > 0 && (
              <section className="product-section mt-section">
                <div className="section-header-block">
                  <h2 className="section-main-heading">ELVÉRA: EDEN</h2>
                </div>
                
                <div className="elvera-grid-4">
                  {edenProducts.map(product => {
                    const primaryImage = product.images?.[0]?.src;
                    const hoverImage = product.images?.[1]?.src || primaryImage;
                    const price = product.variants?.[0]?.price || 0;
                    return (
                      <div key={product.id} className="elvera-product-card">
                        <Link to={`/product/${product.handle}`} className="elvera-image-box">
                          <img src={primaryImage} alt={product.title} className="image-primary" loading="lazy" />
                          <img src={hoverImage} alt={product.title} className="image-secondary" loading="lazy" />
                        </Link>
                        <div className="elvera-card-content">
                          <h3 className="elvera-card-title">{product.title}</h3>
                          <p className="elvera-card-price">{formatPrice(price)}</p>
                          <Link to={`/product/${product.handle}`} className="elvera-btn-view">
                            View Product
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SECTION 3: ELVÉRA: FORM */}
            {formProducts.length > 0 && (
              <section className="product-section mt-section">
                <div className="section-header-block">
                  <h2 className="section-main-heading">ELVÉRA: FORM</h2>
                </div>
                
                <div className="elvera-grid-4">
                  {formProducts.map(product => {
                    const primaryImage = product.images?.[0]?.src;
                    const hoverImage = product.images?.[1]?.src || primaryImage;
                    const price = product.variants?.[0]?.price || 0;
                    return (
                      <div key={product.id} className="elvera-product-card">
                        <Link to={`/product/${product.handle}`} className="elvera-image-box form-specific-bg">
                          <img src={primaryImage} alt={product.title} className="image-primary" loading="lazy" />
                          <img src={hoverImage} alt={product.title} className="image-secondary" loading="lazy" />
                        </Link>
                        <div className="elvera-card-content">
                          <h3 className="elvera-card-title">{product.title}</h3>
                          <p className="elvera-card-price">{formatPrice(price)}</p>
                          <Link to={`/product/${product.handle}`} className="elvera-btn-view">
                            View Product
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
