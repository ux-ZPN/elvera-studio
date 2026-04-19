import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import ProductCard from '../components/ProductCard';
import { X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import './Product.css';

const VALID_PINCODES = ['110001', '400001', '560001', '600001', '700001', '781001']; // Sample India tier 1

const Product = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState('');
  
  const [activeSlide, setActiveSlide] = useState(0);
  const galleryRef = useRef(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userSession, setUserSession] = useState(null);

  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  const [cartAnimation, setCartAnimation] = useState(false);

  // Simulated deterministic stock
  const [stockStatus, setStockStatus] = useState({ available: true, quantity: 10 });

  useEffect(() => {
    // Reset state on ID change
    setLoading(true);
    setSelectedSize('');
    setPincodeStatus(null);
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUserSession(session);

        // Fetch current product dynamically via its Shopify Handle
        const response = await fetch(`https://elverastudio.in/products/${handle}.json`);
        
        if (!response.ok) {
          console.error("Product not found");
          navigate('/collections/all');
          return;
        }

        const data = await response.json();
        const currentProd = data.product;

        if (!currentProd) {
          navigate('/collections/all');
          return;
        }

        setProduct(currentProd);
        
        // Fetch related products (You May Also Like) avoiding the current one
        const relatedRes = await fetch('https://elverastudio.in/products.json?limit=6');
        if (relatedRes.ok) {
           const relatedData = await relatedRes.json();
           const others = relatedData.products?.filter(p => p.handle !== handle).slice(0, 3);
           setRelatedProducts(others || []);
        }

        // Shopify variants logic checks
        let isAvailable = true;
        if(currentProd.variants && currentProd.variants.length > 0) {
           // For simple demonstration assuming available if price exists or stock logic matches
           isAvailable = true;
        }
        
        setStockStatus({
          available: isAvailable,
          quantity: isAvailable ? 10 : 0
        });

      } catch (err) {
        console.error("Unexpected error:", err);
        navigate('/collections/all');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [handle, navigate]);

  const handleAddToCart = async () => {
    // 1. Force Sign-in Check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }

    // Small animation class application
    setCartAnimation(true);
    setTimeout(() => setCartAnimation(false), 1000);

    // Save to LocalStorage
    const cart = JSON.parse(localStorage.getItem('elveracart') || '[]');
    const price = product.variants?.[0]?.price || '0.00';
    
    // Check if exists
    const existing = cart.find(i => i.id === product.id && i.size === selectedSize);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        size: selectedSize,
        price,
        image: product.images?.[0]?.src,
        quantity: 1
      });
    }
    localStorage.setItem('elveracart', JSON.stringify(cart));
    
    // Quick success feedback
    // In a real app we might open the cart drawer here
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      setPincodeStatus({ type: 'error', text: 'Enter a valid 6-digit pincode.' });
      return;
    }
    
    // Dummy check logic
    if (VALID_PINCODES.includes(pincode) || pincode.startsWith('4') || pincode.startsWith('1')) {
      setPincodeStatus({ type: 'success', text: 'Delivery available in 3–5 days!' });
    } else {
      setPincodeStatus({ type: 'error', text: 'Sorry, we do not deliver to this pincode yet.' });
    }
  };

  const toggleZoom = (imgSrc) => {
    if (isZoomed) {
      setIsZoomed(false);
      setZoomedImage('');
    } else {
      setZoomedImage(imgSrc);
      setIsZoomed(true);
    }
  };

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if(newIndex !== activeSlide) setActiveSlide(newIndex);
  };

  const scrollToSlide = (index) => {
    if(galleryRef.current){
      const width = galleryRef.current.clientWidth;
      galleryRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    if (activeSlide < (product.images?.slice(0, 2).length || 0) - 1) {
      scrollToSlide(activeSlide + 1);
    }
  };

  const prevSlide = () => {
    if (activeSlide > 0) {
      scrollToSlide(activeSlide - 1);
    }
  };

  if (loading) return <div className="product-page-loader">Loading...</div>;
  if (!product) return null;

  const price = product.variants?.[0]?.price || '0.00';
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(price);

  // Parse generic HTML body or fallback
  const descriptionHtml = product.body_html || "<p>No description available.</p>";

  // Extract Sizes
  let sizesInfo = [];
  const sizeOption = product.options?.find(opt => opt.name.toLowerCase() === 'size');
  if (sizeOption) {
    sizesInfo = sizeOption.values.map(val => {
      // Find matching variant to see if it's available
      const relatedVariant = product.variants?.find(v => v.option1 === val || v.option2 === val);
      return {
        name: val,
        available: relatedVariant ? (relatedVariant.available !== false) : true
      };
    });
  } else if (product.variants) {
    const rawSizes = [...new Set(product.variants.map(v => v.option2 || v.option1).filter(Boolean))];
    sizesInfo = rawSizes.map(val => {
      const v = product.variants?.find(v => v.option1 === val || v.option2 === val);
      return { name: val, available: v ? (v.available !== false) : true };
    });
  }

  const images = product.images?.slice(0, 2) || [];

  return (
    <>
      {/* Zoom Modal overlay */}
      {isZoomed && (
        <div className="zoom-modal" onClick={() => toggleZoom('')}>
          <button className="close-zoom"><X size={32} color="#fff" /></button>
          <img src={zoomedImage} alt="Zoomed" className="zoom-image" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="product-page-container animate-fade-in">
        
        {/* Main Two Column */}
      <div className="product-main container">
        
        {/* Left Column: Image Gallery */}
        <div className="product-gallery">
          <div className="gallery-swipe-wrapper">
            {images.length > 1 && (
              <>
                <button className={`gallery-arrow prev ${activeSlide === 0 ? 'disabled' : ''}`} onClick={prevSlide} aria-label="Previous image">
                  <ChevronLeft size={24} />
                </button>
                <button className={`gallery-arrow next ${activeSlide === images.length - 1 ? 'disabled' : ''}`} onClick={nextSlide} aria-label="Next image">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            <div className="gallery-swipe-container" ref={galleryRef} onScroll={handleScroll}>
              {images.map((img, i) => (
                <div 
                  key={img.id || i} 
                  className="gallery-item"
                  onClick={() => toggleZoom(img.src)}
                >
                  <img src={img.src} alt={`${product.title} ${i}`} />
                  <div className="zoom-hint hidden-mobile"><Search size={20} /> Click to zoom</div>
                </div>
              ))}
            </div>
          </div>
          {images.length > 1 && (
            <div className="gallery-dots">
              {images.map((_, i) => (
                <button 
                  key={i} 
                  className={`dot ${i === activeSlide ? 'active' : ''}`} 
                  onClick={() => scrollToSlide(i)}
                  aria-label={`Go to image ${i+1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="product-info-col">
          <h1 className="product-headline">{product.title}</h1>
          <p className="product-price-large">{formattedPrice}</p>

          <div className="product-form">
            
            {/* Sizes */}
            <div className="size-selector-container">
              <div className="size-header">
                <span className="size-label">Size {selectedSize && `: ${selectedSize}`}</span>
                <button 
                  type="button" 
                  className="size-guide-btn"
                  onClick={() => setShowSizeModal(true)}
                >
                  Size Guide
                </button>
              </div>
              <div className="size-pills">
                {sizesInfo.map(sz => (
                  <button
                    key={sz.name}
                    type="button"
                    disabled={!sz.available}
                    className={`size-pill ${selectedSize === sz.name ? 'selected' : ''} ${!sz.available ? 'disabled' : ''}`}
                    onClick={() => sz.available && setSelectedSize(sz.name)}
                  >
                    {sz.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart & Stock */}
            <div className="action-area">
              {stockStatus.quantity <= 5 && stockStatus.quantity > 0 && stockStatus.available && (
                <div className="stock-warning">
                  <span>🔥</span> Only {stockStatus.quantity} left!
                </div>
              )}
              
              <button 
                className={`add-to-cart-btn ${cartAnimation ? 'animating' : ''} ${!stockStatus.available ? 'sold-out' : ''}`}
                onClick={handleAddToCart}
                disabled={!stockStatus.available}
              >
                {!stockStatus.available ? "Sold Out" : 
                 cartAnimation ? "Added to Cart ✓" : "Add to Cart"}
                
                {/* Mini flying dot for animation */}
                {cartAnimation && <span className="flying-dot"></span>}
              </button>
            </div>

            {/* Pincode Checker */}
            <div className="pincode-checker">
              <h4>Check Delivery</h4>
              <form onSubmit={handlePincodeCheck} className="pincode-form">
                <input 
                  type="text" 
                  maxLength="6"
                  placeholder="Enter Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                />
                <button type="submit">Check</button>
              </form>
              {pincodeStatus && (
                <p className={`pincode-status ${pincodeStatus.type}`}>
                  {pincodeStatus.text}
                </p>
              )}
            </div>

            {/* Description Tabs */}
            <div className="product-tabs">
              <div className="tab-headers">
                <button 
                  className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >Description</button>
                <button 
                  className={`tab-btn ${activeTab === 'fabric' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fabric')}
                >Fabric & Care</button>
                <button 
                  className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                  onClick={() => setActiveTab('shipping')}
                >Shipping</button>
              </div>
              <div className="tab-content">
                <div className={`tab-pane ${activeTab === 'description' ? 'active' : ''}`} 
                     dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                <div className={`tab-pane ${activeTab === 'fabric' ? 'active' : ''}`}>
                  <ul>
                    <li>100% Premium Cotton</li>
                    <li>Machine wash cold inside out</li>
                    <li>Do not bleach</li>
                    <li>Tumble dry low</li>
                  </ul>
                </div>
                <div className={`tab-pane ${activeTab === 'shipping' ? 'active' : ''}`}>
                  <p>Standard delivery within 3-5 business days across India.</p>
                  <p>Free returns within 7 days of delivery. Refer to our refund policy for details.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Recommended Section */}
      {relatedProducts.length > 0 && (
        <div className="recommended-section container">
          <h2 className="recommended-title">You May Also Like</h2>
          <div className="recommended-grid">
            {relatedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      </div>

      {/* Size Guide Modal Minimal */}
      {showSizeModal && (
        <div className="modal-overlay" onClick={() => setShowSizeModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSizeModal(false)}><X size={24} /></button>
            <h3>Size Guide</h3>
            <table className="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (in)</th>
                  <th>Length (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>S</td><td>38</td><td>28</td></tr>
                <tr><td>M</td><td>40</td><td>29</td></tr>
                <tr><td>L</td><td>42</td><td>30</td></tr>
                <tr><td>XL</td><td>44</td><td>31</td></tr>
                <tr><td>XXL</td><td>46</td><td>32</td></tr>
              </tbody>
            </table>
            <p className="size-note">Measurements are in inches. Tolerance +/- 0.5 inches.</p>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Product;
