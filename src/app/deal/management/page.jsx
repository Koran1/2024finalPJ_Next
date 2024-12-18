"use client";

import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import React, {  useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import "./management.css";

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const API_URL = `${LOCAL_API_BASE_URL}/deal/management`;
    const [products, setProducts] = useState([
        // {
        //     id: 1,
        //     image: "/images/sample1.jpg",
        //     name: "상품 1",
        //     status: "판매중",
        //     price: "10,000원",
        //     lastModified: new Date(),
        // },
        // {
        //     id: 2,
        //     image: "/images/sample2.jpg",
        //     name: "상품 2",
        //     status: "판매완료",
        //     price: "20,000원",
        //     lastModified: new Date(),
        // },
    ]);

    // 데이터 가져오기
    const getData = async () => {
        try {
            setLoading(true); // 로딩 상태 시작
            const response = await axios.get(API_URL); // axios를 사용한 API 호출
            const data = response.data.data;
            // console.log(res.data)
            setProducts(data);
        } catch (err) {
            console.error("Error fatching data : ", err) ;
            setError(err.message);
        } finally {
            setLoading(false) ; // 로딩 상태 종료 
        }
    }

    // State to track active link
    const [activeLink, setActiveLink] = useState('/deal/management');

    // Function to determine the active class
    const getActiveClass = (link) => {
        return activeLink === link ? 'active' : '';
    };

    // 최초 한 번만 실행
    useEffect(() => {
        getData();
    }, []);

    // 로딩 중 화면
    if (loading) {
        return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
    }
    // 에러 발생 시 화면
    if (error) {
        return <div style={{ textAlign: "center", padding: "20px", color: "red" }}>Error: {error}</div>;
    }
    // 로딩 완료 후 화면
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
                <div className="part">상품 {products.length}개</div>
            </div>

            {/* 상품 목록 테이블 */}
            <table className="product-table">
                <thead>
                    <tr>
                        <th>사진</th>
                        <th>판매상태</th>
                        <th>상품명</th>
                        <th>가격</th>
                        <th>최근 수정일</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ?
                        <>
                            <TableRow>
                                <TableCell colSpan={2} style={{ textAlign: "center" }}>등록된 정보가 없습니다.</TableCell>
                            </TableRow>

                        </>

                        : products.map((product) => (
                            <tr key={product.id}>
                                {/* 사진 클릭 시 상세 페이지 이동 */}
                                <td>
                                    <Link href={`/product/${product.id}`}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            width="50"
                                            height="50"
                                            style={{ cursor: "pointer" }}
                                        />
                                    </Link>
                                </td>
                                {/* 판매 상태 */}
                                <td>{product.status}</td>
                                {/* 상품명 클릭 시 상세 페이지 이동 */}
                                <td>
                                    <Link
                                        href={`/detail/${product.dealIdx}`}
                                        style={{ textDecoration: "none", color: "black" }}
                                    >
                                        {product.name}
                                    </Link>
                                </td>
                                {/* 가격 */}
                                <td>{product.price}</td>
                                {/* 최근 수정일 */}
                                <td>{product.lastModified.toLocaleDateString()}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default Page;
