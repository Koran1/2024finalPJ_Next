import { useEffect, useState } from 'react';
import '../interest/interest.css';
import { Link } from '@mui/material';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';

const MainProductCard = ({ product, favProducts }) => {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
  const [isFavorite, setIsFavorite] = useState(false);
  const {user} = useAuthStore();
  
  const toggleFavorite = (dealIdx) => {
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
      const response = axios.delete(`${LOCAL_API_BASE_URL}/deal/deleteFavorite?dealIdx=${dealIdx}&userIdx=${user.userIdx}`)    
                        .then((res) => console.log(res.data.message))
                        .catch((err) => console.log(err))
    }
    
    setIsFavorite(!isFavorite);
  };
  
  // 관심 등록 여부 판별
  useEffect(() => {
    favProducts.map((fav) => {
      if(fav.dealIdx === product.dealIdx) setIsFavorite(true)
    })
  }, [favProducts])
  
  return (
    <div className="product-card1" key={product.dealIdx}>
      <div className="card-content1">
        <div className="heart-icon" onClick={() => toggleFavorite(product.dealIdx)}>
          {isFavorite ? (
            <span className="filled-heart">❤️</span>
          ) : (
            <span className="empty-heart">🤍</span>
          )}
        </div>
        <Link href={`/deal/detail/${product.dealIdx}`}>
          <img src={`${LOCAL_IMG_URL}/deal/${product.deal01}` || "https://placehold.jp/180x200.png"} alt={product.name} className="product-image1" />
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
