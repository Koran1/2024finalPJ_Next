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
                setLoading(true);
                const API_URL = `${LOCAL_API_BASE_URL}/deal/management/${user.userIdx}`;
                const response = await axios.get(API_URL);
                
                if (response.data.success) {
                    const uniqueItems = response.data.data.reduce((acc, current) => {
                        const existingItem = acc.find(item => item.dealIdx === current.dealIdx);
                        if (!existingItem) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);
                    
                    setItem(uniqueItems);
                } else {
                    setError("Failed to fetch product data.");
                }
            } catch (err) {
                console.error("Error fetching product data:", err);
                setError("Failed to fetch product data.");
            } finally {
                setLoading(false);
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
                <div className="purchase-info">
                    <div className="pi">상품 상세 정보</div>
                    <div className="pi-count">상품 {item.length}개</div>
                </div>

                {item.length > 0 ? (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>상품이미지</th>
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
                                                <img 
                                                    src={`${LOCAL_IMG_URL}/deal/${k.deal01}`} 
                                                    alt={k.dealTitle} 
                                                    width="50" 
                                                    height="50" 
                                                />
                                            </Link>
                                        </td>
                                        <td>{k.deal02 || '판매중'}</td>
                                        <td>
                                            <Link href={`/deal/detail/${k.dealIdx}`} style={{ textDecoration: "none" }}>
                                                {k.dealTitle}
                                            </Link>
                                        </td>
                                        <td>
                                            {k.dealPrice === 0 
                                                ? '나눔' 
                                                : `${k.dealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`
                                            }
                                        </td>
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
