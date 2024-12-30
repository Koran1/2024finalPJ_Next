import React from 'react';
import ProductCard from './ProductCard';

const ProductList = () => {
  const products = [
    { id: 1, name: '캠핑랜턴', seller:'곰돌이', price:'31,000원', description:'캠핑 랜턴 판매합니다. 새 상품입니다.',  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Lampada_a_petrolio.jpg/200px-Lampada_a_petrolio.jpg' },
    { id: 2, name: '캠핑랜턴', seller:'곰돌이', price:'31,000원', description:'캠핑 랜턴 판매합니다. 새 상품입니다.',  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Lampada_a_petrolio.jpg/200px-Lampada_a_petrolio.jpg' },
    { id: 3, name: '상품3', seller:'Michael', price:'3,210원', image: 'https://via.placeholder.com/150' },
    { id: 4, name: '상품4', image: 'https://image.yes24.com/goods/110793224/XL' },
    { id: 5, name: '상품5', image: 'https://via.placeholder.com/150' },
    { id: 6, name: '상품6', image: 'https://via.placeholder.com/150' },
  ];

  return (
      <div style={styles.list}>
          <div className="part" style={styles.rating}> 찜 {products.length}개</div>
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
