"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import "./purchase.css";

// 구매 내역 페이지

function Page({ params }) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const [item, setItem] = useState(null);                 // 데이터 상태
    const [loading, setLoading] = useState(true);           // 로딩 상태
    const [error, setError] = useState(null);               // 에러 상태


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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // 로딩 시작
                console.log("Fetching data...");
                console.log("params:", params);

                const { userIdx } = await Promise.resolve(params);
                const API_URL = `${LOCAL_API_BASE_URL}/deal/purchase/${userIdx}`;

                // 데이터 가져오기
                const response = await axios.get(API_URL);
                // const data = response.data;
                console.log(response);
                if (response.data.success) {
                    setItem(response.data.data);
                    console.log("setItem: ", response.data.data);
                } else {
                    setError("Failed to fetch product data.");
                }
            } catch (err) {
                console.error("Error fetching product data:", err);
                setError("Failed to fetch product data.");
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchData();
    }, [params, LOCAL_API_BASE_URL]);

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


            {/* 구매 정보는 별도의 줄로 배치 */}
            <hr />
            <div className="purchase-info">
                <div className="part">구매 {products.length}개</div>
            </div>

            
        </div>

    );
}

export default Page;
