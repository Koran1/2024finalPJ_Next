import React, { useState } from 'react';
import '../interest/interest.css';
import { Link } from '@mui/material';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';

const MainProductCard = ({ product }) => {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const [isFavorite, setIsFavorite] = useState(false);
  const {user} = useAuthStore();

  const toggleFavorite = () => {
    if (!isFavorite) {
      alert("관심 저장 ");
      const API_URL = `${LOCAL_API_BASE_URL}/deal/dealMainfavorite`
      const response = axios.get(`${API_URL}?userIdx=${user.userIdx}&dealIdx=${product.dealIdx}`)
        .then((res) => {
          console.log(res.data);
          if (res.data.success) {
            setProducts(res.data.data);
            console.log(res.data.message)
          } else {
            console.log(res.data.message)
          }
        })
        .catch((err) => console.log(err))
    } else {
      alert("관심 해제 ");

    }

    setIsFavorite(!isFavorite);
  };

  return (
    <div className="product-card" key={product.dealIdx}>
      <div className="card-content">
        <div className="heart-icon" onClick={toggleFavorite}>
          {isFavorite ? (
            <span className="filled-heart">❤️</span>
          ) : (
            <span className="empty-heart">🤍</span>
          )}
        </div>
        <Link href={`/deal/detail/${product.dealIdx}`}>
          <img src={`${LOCAL_IMG_URL}/deal/${product.deal01}` || "https://placehold.jp/180x200.png"} alt={product.name} className="product-image" />
          <div className="product-info">
            <div className="seller-name">{product.dealSellerNick}</div>
            <div className="product-name">{product.dealTitle}</div>
            <div className="product-price">{product.dealPrice}</div>
            <div className="description">{product.dealDescription}</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MainProductCard;
