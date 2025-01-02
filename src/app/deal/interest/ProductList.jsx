import React from 'react';
import ProductCard from './ProductCard';

const ProductList = () => {
  const products = [
    { id: 1, name: '상품1', image: 'https://via.placeholder.com/150' },
    { id: 2, name: '상품2', image: 'https://via.placeholder.com/150' },
    { id: 3, name: '상품3', image: 'https://via.placeholder.com/150' },
    { id: 4, name: '상품3', image: 'https://via.placeholder.com/150' },
    { id: 5, name: '상품3', image: 'https://via.placeholder.com/150' },
    { id: 6, name: '상품3', image: 'https://via.placeholder.com/150' },
  ];

  return (
      <div style={styles.list}>
          <div className="part" style={styles.rating}> 평점 {products.length}개</div>
      {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
    </div>
  );
};

const styles = {
  list: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  },
  rating: {
    width: '100%',         // 전체 가로폭을 차지하도록 설정
    textAlign: 'right',    // 텍스트를 오른쪽 정렬
    marginBottom: '10px', // Space between the rating and product cards
  },
};

export default ProductList;
