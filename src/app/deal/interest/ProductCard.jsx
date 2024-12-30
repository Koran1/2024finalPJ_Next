import React, { useState } from 'react';
import './interest.css';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="product-card">
      <div className="card-content">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="heart-icon" onClick={toggleFavorite}>
          {isFavorite ? (
            <span className="filled-heart">❤️</span>
          ) : (
            <span className="empty-heart">🤍</span>
          )}
        </div>
      </div>
      <div className="product-info">
        <div className="seller-name">{product.seller}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-price">{product.price}</div>
        <div className="description">{product.description}</div>
      </div>
    </div>
  );
};

export default ProductCard;
