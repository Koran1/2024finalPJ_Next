import React, { useState } from 'react';
import './interest.css';
import { Link } from '@mui/material';
import axios from 'axios';
import useAuthStore from '../../../../store/authStore';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(true);
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const {user} = useAuthStore();

  const toggleFavorite = () => {
    if (!isFavorite) {
      const API_URL = `${LOCAL_API_BASE_URL}/deal/dealMainfavorite`
      const response = axios.get(`${API_URL}?userIdx=${user.userIdx}&dealIdx=${product.dealIdx}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          console.log(res.data.message)
        } else {
          console.log(res.data.message)
        }
      })
      .catch((err) => console.log(err))
    } else {
      const response = axios.delete(`${LOCAL_API_BASE_URL}/deal/deleteFavorite?dealIdx=${product.dealIdx}&userIdx=${user.userIdx}`)    
                        .then((res) => console.log(res.data.message))
                        .catch((err) => console.log(err))
    }
    
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="product-card">
      <div className="card-content">
        <div className="heart-icon" onClick={toggleFavorite}>
          {isFavorite ? (
            <span className="filled-heart">❤️</span>
          ) : (
            <span className="empty-heart">🤍</span>
          )}
        </div>
      </div>
      <div className="product-info2">
        <Link href={`/deal/detail/${product.dealIdx}`}>
          <img src={`${LOCAL_IMG_URL}/deal/${product.deal01}` || "https://placehold.jp/180x200.png"} alt={product.dealTitle} className="product-image2" />
          <div className="seller-name2">{product.dealSellerNick}</div>
          <div className="product-name2">{product.dealTitle}</div>
          <div className="product-price2">{product.dealPrice}</div>
          <div className="description2">{product.dealDescription}</div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
