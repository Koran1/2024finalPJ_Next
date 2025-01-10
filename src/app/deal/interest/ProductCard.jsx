import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import useAuthStore from '../../../../store/authStore';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(true);
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const { user } = useAuthStore();

  const toggleFavorite = () => {
    if (!isFavorite) {
      const API_URL = `${LOCAL_API_BASE_URL}/deal/dealMainfavorite`;
      axios.get(`${API_URL}?userIdx=${user.userIdx}&dealIdx=${product.dealIdx}`)
        .then((res) => {
          if (res.data.success) {
            console.log(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    } else {
      axios.delete(`${LOCAL_API_BASE_URL}/deal/deleteFavorite?dealIdx=${product.dealIdx}&userIdx=${user.userIdx}`)
        .then((res) => console.log(res.data.message))
        .catch((err) => console.log(err));
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="inter-product-item">
      <div className="inter-heart-icon" onClick={toggleFavorite}>
        {isFavorite ? (
          <span className="inter-filled-heart">❤️</span>
        ) : (
          <span className="inter-empty-heart">🤍</span>
        )}
      </div>
      <Link 
        href={`/deal/detail/${product.dealIdx}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <img
          className="inter-dealMain-image"
          src={`${LOCAL_IMG_URL}/deal/${product.deal01}` || "/images/defaultImage.png"}
          alt={product.dealTitle}
          style={{ width: "180px", height: "200px" }}
          onError={(e) => {
            e.target.src = "/images/defaultImage.png";
          }}
        />
        <div className="inter-product-content">
          <div className="inter-nick">{product.dealSellerNick}</div>
          <div className="inter-title">{product.dealTitle}</div>
          <div className="inter-price">
            {product.dealPrice == 0 ? '나눔' : `${product.dealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}
          </div>
          <div className="inter-view-count">
            <VisibilityIcon style={{ fontSize: '1.2rem' }} />
            <span> {product.dealCount}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
