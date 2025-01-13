import React, { useEffect, useState } from 'react';
import './dealMain.css';
import Link from 'next/link';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import VisibilityIcon from '@mui/icons-material/Visibility';

function MainProductCard({ product, favProducts }) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
    const [isFavorite, setIsFavorite] = useState(false);
    const { isAuthenticated, user, token, isExpired } = useAuthStore();
    const router = useRouter();

    // 찜 상태 초기화 수정
    useEffect(() => {
        // favProducts가 배열인지 확인
        if (Array.isArray(favProducts) && product?.dealIdx) {
            setIsFavorite(favProducts.includes(product.dealIdx));
        }
    }, [product?.dealIdx, favProducts]); // 의존성 배열 수정

    const toggleFavorite = async (dealIdx, e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        
        if (!isAuthenticated || isExpired()) {
            alert('로그인이 필요한 서비스입니다.');
            router.push("/user/login");
            return;
        }

        try {
            if (!isFavorite) {
                const response = await axios.get(`${LOCAL_API_BASE_URL}/deal/dealMainfavorite`, {
                    params: {
                        userIdx: user.userIdx,
                        dealIdx: dealIdx
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (response.data.success) {
                    setIsFavorite(true);
                }
            } else {
                const response = await axios.delete(`${LOCAL_API_BASE_URL}/deal/deleteFavorite`, {
                    params: {
                        dealIdx: dealIdx,
                        userIdx: user.userIdx
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (response.data.success) {
                    setIsFavorite(false);
                }
            }
        } catch (error) {
            console.error('찜하기 토글 실패:', error);
        }
    };

    // dealview 상태에 따른 표시 여부 확인
    const shouldShowProduct = () => {
        return product.dealview === 1 ||
            (product.dealview === 0 && user?.userIdx === product.dealSellerUserIdx);
    };

    // 상품을 표시하지 않아야 할 경우 null 반환
    if (!shouldShowProduct()) {
        return null;
    }

    return (
        <div className="product-item" key={product.dealIdx}>
            {product.dealview === 0 && (
                <div className="inactive-notice">
                    Disabled
                </div>
            )}
            <div className="heart-icon" onClick={(e) => toggleFavorite(product.dealIdx, e)}>
                {isFavorite ? (
                    <span className="filled-heart">❤️</span>
                ) : (
                    <span className="empty-heart">🤍</span>
                )}
            </div>
            <Link href={`/deal/detail/${product.dealIdx}`}>
                <div className="image-container">
                    <img
                        className="dealMain-image"
                        src={product.deal01
                            ? `${LOCAL_IMG_URL}/deal/${product.deal01}`
                            : "/images/defaultImage.png"}
                        alt={product.dealTitle}
                        style={{ width: "180px", height: "200px" }}
                        onError={(e) => {
                            console.log("Image load error:", e);
                            e.target.src = "/images/defaultImage.png";
                        }}
                    />
                    {product.deal02 === '판매완료' && (
                        <div className="sold-out-overlay">
                            SOLD OUT
                        </div>
                    )}
                </div>
                <div className="product-content">
                    <div className="nick">{product.dealSellerNick}</div>
                    <div className="title">{product.dealTitle}</div>
                    <div className="price">
                        {product.dealPrice == 0 ? '나눔' : `${product.dealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}
                    </div>
                    {/* 조회수 */}
                    <div className="view-count">
                        <VisibilityIcon style={{ fontSize: '1.2rem' }} />
                        <span> {product.dealCount}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default MainProductCard;