"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import "./purchase.css";
import useAuthStore from "../../../../store/authStore";
import { Box } from "@mui/material";

// 구매 내역 페이지

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
    const [item, setItem] = useState(null);                 // 데이터 상태
    const [loading, setLoading] = useState(true);           // 로딩 상태
    const [error, setError] = useState(null);               // 에러 상태

    const { user } = useAuthStore();

    useEffect(() => {
        if (user == null) return;
        const fetchData = async () => {
            try {
                setLoading(true); // 로딩 시작
                console.log("Fetching data...");

                const API_URL = `${LOCAL_API_BASE_URL}/deal/purchase/${user.userIdx}`;

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
    }, [user, LOCAL_API_BASE_URL]);

    // State to track active link
    const [activeLink, setActiveLink] = useState('/deal/purchase');

    // Function to determine the active class
    const getActiveClass = (link) => {
        return activeLink === link ? 'active' : '';
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
                <div className="part">구매 {item.length}개</div>
                {item.length > 0 ?

                    item.map((product) => (
                        <Box key={product.dealIdx}>
                            <Link href={`/deal/detail/${product.dealIdx}`}>
                                <img src={`${LOCAL_IMG_URL}/deal/${product.deal01}` || "https://placehold.jp/180x200.png"} alt={product.dealTitle} className="product-image2" />
                                <div >{product.dealSellerNick}</div>
                                <div >{product.dealTitle}</div>
                                <div >{product.dealPrice}</div>
                                <div >{product.dealDescription}</div>
                            </Link>
                        </Box>
                    ))
                    :
                    <h2>구매한 상품이 없습니다.</h2>
                }
            </div>


        </div>

    );
}

export default Page;
