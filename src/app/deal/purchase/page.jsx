"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./purchase.css";

// 구매 내역 페이지

function Page() {
    const [products, setProducts] = useState([
        {
            id: 1,
            image: "/images/sample1.jpg",
            name: "상품 1",
            status: "판매중",
            price: "10,000원",
            lastModified: new Date(),
        },
        {
            id: 2,
            image: "/images/sample2.jpg",
            name: "상품 2",
            status: "판매완료",
            price: "20,000원",
            lastModified: new Date(),
        },
    ]);

    // State to track active link
    const [activeLink, setActiveLink] = useState('/deal/purchase');

    // Function to determine the active class
    const getActiveClass = (link) => {
        return activeLink === link ? 'active' : '';
    };


// 구매 내역 페이지

    return (
        <div className="pd-reg-container">
            {/* 상단 네비게이션 */}
            <div >
                <Link href="/deal/management"
                    className={`btn1 ${getActiveClass('/deal/management')}`}
                    onClick={() => setActiveLink('/deal/management')}>
                    상품 관리
                </Link>
                <Link href="/deal/purchase"
                    className={`btn1 ${getActiveClass('/deal/purchase')}`}
                    onClick={() => setActiveLink('/deal/purchase')}>
                    구매 내역
                </Link>
                <Link href="/deal/interest"
                    className={`btn1 ${getActiveClass('/deal/interest')}`}
                    onClick={() => setActiveLink('/deal/interest')}>
                    관심 목록
                </Link>
                <Link href="/deal/rating"
                    className={`btn1 ${getActiveClass('/deal/rating')}`}
                    onClick={() => setActiveLink('/deal/rating')}>
                    나의 평점
                </Link>
                <Link href="/deal/message"
                    className={`btn1 ${getActiveClass('/deal/message')}`}
                    onClick={() => setActiveLink('/deal/message')}>
                    쪽지 목록
                </Link>
                <br />
                <div className="part">구매 {products.length}개</div>
            </div>

            {/* 상품 목록 테이블 */}
            
        </div>
    );
}

export default Page;
