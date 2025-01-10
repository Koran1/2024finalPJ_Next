"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./interest.css";
import ProductCard from './ProductCard';
import axios from 'axios';
import useAuthStore from '../../../../store/authStore';

function Page() {
    const [activeLink, setActiveLink] = useState('/deal/interest');
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const { user } = useAuthStore();
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        if(user == null) return;
        const response = axios.get(`${LOCAL_API_BASE_URL}/deal/getFavoriteList?userIdx=${user.userIdx}`)
            .then((res) => {
                console.log(res.data);
                setProducts(res.data.data);
            });
    }, [user, LOCAL_API_BASE_URL]);

    const getActiveClass = (link) => {
        return activeLink === link ? 'active' : '';
    };

    return (
        <div className="inter-pd-reg-container">
            <div className="inter-nav-links">
                <Link href="/deal/management" className={`inter-btn1 ${getActiveClass('/deal/management')}`}>
                    상품관리
                </Link>
                <span className="inter-nav-divider">|</span>
                <Link href="/deal/purchase" className={`inter-btn1 ${getActiveClass('/deal/purchase')}`}>
                    구매내역
                </Link>
                <span className="inter-nav-divider">|</span>
                <Link href="/deal/interest" className={`inter-btn1 ${getActiveClass('/deal/interest')}`}>
                    관심목록
                </Link>
                <span className="inter-nav-divider">|</span>
                <Link href="/deal/rating" className={`inter-btn1 ${getActiveClass('/deal/rating')}`}>
                    나의평점
                </Link>
                <span className="inter-nav-divider">|</span>
                <Link href="/deal/message" className={`inter-btn1 ${getActiveClass('/deal/message')}`}>
                    채팅목록
                </Link>
            </div>

            <hr />
            <div className="inter-interest-info">
                <div>
                    <div className="inter-interest-title">나의 관심 상품</div>
                </div>
                <div className="inter-i-count">찜 {products.length}개</div>
            </div>

            <div className="inter-product-grid">
                {products.map((product) => (
                    <ProductCard key={product.dealIdx} product={product} />
                ))}
            </div>
        </div>
    );
}

export default Page;
