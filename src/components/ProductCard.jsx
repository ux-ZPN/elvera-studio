import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const title = product.title;
  const imageSrc = product.images?.length > 0 ? product.images[0].src : '';
  const hoverImageSrc = product.images?.length > 1 ? product.images[1].src : imageSrc;

  const price = product.variants?.length > 0 ? product.variants[0].price : '0.00';

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  const isAvailable = product.variants ? product.variants.some(v => v.available) : true;

  let sizes = [];
  const sizeOption = product.options?.find(opt => opt.name.toLowerCase() === 'size');
  if (sizeOption) {
    sizes = sizeOption.values;
  } else if (product.variants) {
    const rawSizes = product.variants.map(v => v.option2 || v.option1);
    sizes = [...new Set(rawSizes.filter(Boolean))];
  }

  return (
    <Link to={`/products/${product.id}`} className={`product-card ${!isAvailable ? 'sold-out' : ''}`}>
      <div className="product-image-container">
        {/* NEW Badge */}
        <span className="product-new-badge">New</span>

        {imageSrc ? (
          <>
            <img src={imageSrc} alt={title} className="product-image primary-image" loading="lazy" />
            <img src={hoverImageSrc} alt={`${title} alternate`} className="product-image hover-image" loading="lazy" />
          </>
        ) : (
          <div className="product-image-placeholder">No Image</div>
        )}

        {!isAvailable && <div className="sold-out-badge">Sold Out</div>}
      </div>

      <div className="product-details">
        <h3 className="product-title">{title}</h3>
        <p className="product-price">{formattedPrice}</p>
        {sizes.length > 0 && (
          <div className="product-sizes-preview">
            {sizes.slice(0, 5).map((s, i) => (
              <span key={i} className="size-pill">{s}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
