import React, { useState } from 'react';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <div style={styles.heartIcon} onClick={toggleFavorite}>
        {isFavorite ? (
          <span style={styles.filledHeart}>❤️</span>
        ) : (
          <span style={styles.emptyHeart}>🤍</span>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    position: 'relative',
    width: '150px',
    height: '200px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  heartIcon: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    cursor: 'pointer',
    fontSize: '24px',
  },
  filledHeart: {
    color: 'red',
  },
  emptyHeart: {
    color: 'gray',
  },
};

export default ProductCard;
