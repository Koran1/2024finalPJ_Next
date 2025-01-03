import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';
import useAuthStore from '../../../../store/authStore';

const ProductList = () => {

  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const {user} = useAuthStore();

  const [products, setProducts] = useState([])
  
  useEffect(() => {
    if(user == null) return
    const response = axios.get(`${LOCAL_API_BASE_URL}/deal/getFavoriteList?userIdx=${user.userIdx}`)
                      .then((res) => {
                        console.log(res.data)
                        setProducts(res.data.data)

                      })
  }, [user])


  return (
      <div style={styles.list}>
          <div className="part" style={styles.rating}> 찜 {products.length}개</div>
      {products.map((product) => (
          <ProductCard key={product.dealIdx} product={product} />
        ))}
    </div>
  );
};

const styles = {
  list: {
    display: 'flex',
    gap: '10px',
  },
  rating: {
    width: '100%',         // 전체 가로폭을 차지하도록 설정
    textAlign: 'right',    // 텍스트를 오른쪽 정렬
    marginBottom: '10px', // Space between the rating and product cards
  },
};

export default ProductList;
