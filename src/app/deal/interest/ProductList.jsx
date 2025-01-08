import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';
import useAuthStore from '../../../../store/authStore';

const ProductList = () => {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const {user} = useAuthStore();
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    if(user == null) return;
    const response = axios.get(`${LOCAL_API_BASE_URL}/deal/getFavoriteList?userIdx=${user.userIdx}`)
      .then((res) => {
        console.log(res.data);
        setProducts(res.data.data);
      });
  }, [user]);

  return (
    <div>
      <div className="f-count">찜 {products.length}개</div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.dealIdx} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
