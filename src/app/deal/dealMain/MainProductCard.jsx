import React, { useEffect, useState } from 'react';
import './dealMain.css';
import Link from 'next/link';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function MainProductCard({ product, favProducts }) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
    const [isFavorite, setIsFavorite] = useState(false);
    const { isAuthenticated, user, isExpired } = useAuthStore();
    const router = useRouter();

    const toggleFavorite = (dealIdx) => {
        if (!isAuthenticated || isExpired()) {
            alert('로그인이 필요한 서비스입니다.');
            router.push("/user/login");
            return;
        }

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
            if (fav.dealIdx === product.dealIdx) setIsFavorite(true)
        })
    }, [favProducts])

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
            <div className="heart-icon" onClick={() => toggleFavorite(product.dealIdx)}>
                {isFavorite ? (
                    <span className="filled-heart">❤️</span>
                ) : (
                    <span className="empty-heart">🤍</span>
                )}
            </div>
            <Link href={`/deal/detail/${product.dealIdx}`}>
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
                <div className="product-content">
                    <div className="nick">{product.dealSellerNick}</div>
                    <div className="title">{product.dealTitle}</div>
                    <div className="price">
                        {product.dealPrice == 0 ? '나눔' : `${product.dealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default MainProductCard;