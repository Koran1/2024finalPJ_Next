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


            {/* 구매 정보는 별도의 줄로 배치 */}
            <hr />
            <div className="purchase-info">
                <div className="p-count">구매 {item.length}개</div>
                {/* <hr/> */}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>구매 상품</TableCell>
                            <TableCell>상품명</TableCell>
                            <TableCell>판매자 명</TableCell>
                            <TableCell>상품 가격</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {item.length > 0 ?

                            item.map((product) => (
                                <TableRow key={product.dealIdx}>
                                    <TableCell>
                                        <Link href={`/deal/detail/${product.dealIdx}`}>
                                            <img src={`${LOCAL_IMG_URL}/deal/${product.deal01}` || "https://placehold.jp/180x200.png"} alt={product.dealTitle} width="150px" height="150px" />
                                        </Link>
                                    </TableCell>
                                    <TableCell >{product.dealTitle}</TableCell>
                                    <TableCell>{product.dealSellerNick}</TableCell>
                                    <TableCell>{product.dealPrice != "0" ? product.dealPrice : "나눔"}</TableCell>
                                </TableRow>
                            ))
                            :
                            <TableRow>
                                <TableCell colSpan={5}>
                                    구매한 상품이 없습니다.
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>

            </div>


        </div>

    );
}

export default Page;
