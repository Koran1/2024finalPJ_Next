"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import "./management.css";
import useAuthStore from "../../../../store/authStore";

function Page() {
    // 선택된 네비게이션 바 표시
    const [activeLink, setActiveLink] = useState("/deal/management");

    // const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    // const [products, setProducts] = useState([]);

    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
    const [item, setItem] = useState([]);                 // 데이터 상태 
    const [loading, setLoading] = useState(true);           // 로딩 상태
    const [error, setError] = useState(null);               // 에러 상태
    const { user } = useAuthStore();       // 로그인 상태

    useEffect(() => {
        if (user == null) return
        const fetchData = async () => {
            try {
                setLoading(true); // 로딩 시작
                const API_URL = `${LOCAL_API_BASE_URL}/deal/management/${user.userIdx}`;

                // 데이터 가져오기
                const response = await axios.get(API_URL);
                // const data = response.data;
                // console.log(response.data);
                if (response.data.success) {
                    console.log("setItem: 이거 데이터.데이터", response.data.data);
                    setItem(response.data.data);
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


    const getActiveClass = (link) => (activeLink === link ? "active" : "");

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // // 글 작성자와 현재 로그인한 사용자 비교 
    // const isOwner = isAuthenticated && String(user.m_id) === String(item.gb_id);

    return (
        <>
            <div className="pd-reg-container">

                <div className="nav-links">
                    <Link href="/deal/management" className={`btn1 ${getActiveClass('/deal/management')}`} onClick={() => setActiveLink('/deal/management')}>상품 관리</Link>
                    <Link href="/deal/purchase" className={`btn1 ${getActiveClass('/deal/purchase')}`} onClick={() => setActiveLink('/deal/purchase')}>구매 내역</Link>
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
                    {/* ... 다른 링크들 */}
                </div>
                <hr />
                <div className="purchase-info">
                    <div className="part">상품 {item.length}개</div>
                </div>

                {/* <h1>상품 상세 정보</h1> */}
                {item.length > 0 ? (
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
                            {item.map((k, idx) => {
                                return (

                                    <tr key={idx}>
                                        <td>
                                            <Link href={`/deal/detail/${k.dealIdx}`}>
                                                <img src={`${LOCAL_IMG_URL}/deal/${k.deal01}`} alt={k.dealTitle} width="50" height="50" />
                                            </Link>
                                        </td>
                                        <td>
                                            {k.dealStatus}
                                        </td>
                                        <td>
                                            <Link href={`/deal/detail/${k.dealIdx}`} style={{ textDecoration: "none" }}>
                                                {k.dealTitle}
                                            </Link>
                                        </td>
                                        <td>{k.dealPrice}</td>
                                        <td>{k.dealRegDate}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>) : ((
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
                                <tr>
                                    <td colSpan="5">상품이 없습니다.</td>
                                </tr>
                            </tbody>
                        </table>
                    ))}
            </div>
        </>
    );
}

export default Page;
