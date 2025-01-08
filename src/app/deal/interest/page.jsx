"use client";

import React, { useState } from "react";
import Link from "next/link";
// import styles from "./interest.module.css";
import "./interest.css";
import ProductList from "./ProductList";

// 관심목록 페이지

function Page() {
    // State to track active link
    const [activeLink, setActiveLink] = useState('/deal/interest');

    // Function to determine the active class
    const getActiveClass = (link) => {
        return activeLink === link ? 'active' : '';
    };


    return (
        <div className="pd-reg-container">
            {/* 상단 네비게이션 */}
            <div className="nav-links">
                <Link href="/deal/management" className={`btn1 ${getActiveClass('/deal/management')}`} onClick={() => setActiveLink('/deal/management')}>
                    상품관리
                </Link>
                <span className="nav-divider">|</span>
                <Link href="/deal/purchase" className={`btn1 ${getActiveClass('/deal/purchase')}`} onClick={() => setActiveLink('/deal/purchase')}>
                    구매내역
                </Link>
                <span className="nav-divider">|</span>
                <Link href="/deal/interest" className={`btn1 ${getActiveClass('/deal/interest')}`} onClick={() => setActiveLink('/deal/interest')}>
                    관심목록
                </Link>
                <span className="nav-divider">|</span>
                <Link href="/deal/rating" className={`btn1 ${getActiveClass('/deal/rating')}`} onClick={() => setActiveLink('/deal/rating')}>
                    나의평점
                </Link>
                <span className="nav-divider">|</span>
                <Link href="/deal/message" className={`btn1 ${getActiveClass('/deal/message')}`} onClick={() => setActiveLink('/deal/message')}>
                    채팅목록
                </Link>
            </div>

            <hr />
         
            <ProductList />
            
        </div>
    );
}

export default Page;
