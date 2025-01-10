"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import "./purchase.css";
import useAuthStore from "../../../../store/authStore";
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

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
        <>
            <div className="purch-pd-reg-container">
                <div className="purch-nav-links">
                    <Link href="/deal/management" className={`purch-btn1 ${getActiveClass('/deal/management')}`} onClick={() => setActiveLink('/deal/management')}>
                        상품관리
                    </Link>
                    <span className="purch-nav-divider">|</span>
                    <Link href="/deal/purchase" className={`purch-btn1 ${getActiveClass('/deal/purchase')}`} onClick={() => setActiveLink('/deal/purchase')}>
                        구매내역
                    </Link>
                    <span className="purch-nav-divider">|</span>
                    <Link href="/deal/interest" className={`purch-btn1 ${getActiveClass('/deal/interest')}`} onClick={() => setActiveLink('/deal/interest')}>
                        관심목록
                    </Link>
                    <span className="purch-nav-divider">|</span>
                    <Link href="/deal/rating" className={`purch-btn1 ${getActiveClass('/deal/rating')}`} onClick={() => setActiveLink('/deal/rating')}>
                        나의평점
                    </Link>
                    <span className="purch-nav-divider">|</span>
                    <Link href="/deal/message" className={`purch-btn1 ${getActiveClass('/deal/message')}`} onClick={() => setActiveLink('/deal/message')}>
                        채팅목록
                    </Link>
                </div>
                <hr />
                <div className="purch-purchase-info">
                    <div>
                        <div className="purch-purchase-title">구매 상세 정보</div>
                    </div>
                    <div className="purch-p-count">구매 {item.length}개</div>
                </div>

                {item.length > 0 ? (
                    <table className="purch-product-table">
                        <thead>
                            <tr>
                                <th>상품이미지</th>
                                <th>상품명</th>
                                <th>가격</th>
                                <th>구매일</th>
                                <th>만족도</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.map((product) => (
                                <tr key={product.dealIdx}>
                                    <td>
                                        <Link href={`/deal/detail/${product.dealIdx}`}>
                                            <img src={`${LOCAL_IMG_URL}/deal/${product.deal01}` || "https://placehold.jp/180x200.png"} 
                                                alt={product.dealTitle} 
                                                width="150px" 
                                                height="150px" 
                                            />
                                        </Link>
                                    </td>
                                    <td>{product.dealTitle}</td>
                                    <td>{product.dealPrice != "0" ? product.dealPrice : "나눔"}</td>
                                    <td>{product.dealDate}</td>
                                    <td>{product.dealSatisfaction}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="purch-product-table">
                        <thead>
                            <tr>
                                <th>상품이미지</th>
                                <th>상품명</th>
                                <th>가격</th>
                                <th>구매일</th>
                                <th>만족도</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={5}>
                                    구매한 상품이 없습니다.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default Page;
