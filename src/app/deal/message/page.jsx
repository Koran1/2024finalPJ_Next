"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./message.css";

// 쪽지

function Page() {
    // State to track active link
    const [activeLink, setActiveLink] = useState('/deal/message');

    // Function to determine the active class
    const getActiveClass = (link) => {
        return activeLink === link ? 'active' : '';
    };


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
                <div className="part"> 평점 39개</div>
            </div>

            
            
        </div>
    );
}

export default Page;
