// app/deal/interest/page.js
"use client";

import React, { useState } from "react";
import Link from "next/link";
// import styles from "./interest.module.css";
import "./interest.css";
import ProductList from "./ProductList";

// 관심 목록 페이지

function Page() {
    return (
        <div className="pd-reg-container">
            {/* 상단 네비게이션 */}
            <div className="nav-links">
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
            </div>

            <hr />

            <ProductList />

        </div>
    );
}

export default Page;
