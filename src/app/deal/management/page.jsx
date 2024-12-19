"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import "./management.css";

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const API_URL = `${LOCAL_API_BASE_URL}/deal/management`;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeLink, setActiveLink] = useState("/deal/management");

    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            const data = response.data?.data?.map((product) => ({
                ...product,
                lastModified: new Date(product.lastModified),
            })) || [];
            setProducts(data);
        } catch (err) {
            console.error("Error fetching data: ", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getActiveClass = (link) => (activeLink === link ? "active" : "");

    useEffect(() => {
        getData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="pd-reg-container">
            <div>
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
                <div className="part">상품 {products.length}개</div>
            </div>
            {products && products.length > 0 ? (
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
                    { (products || []).map((product) => (
                        <tr key={product.id}>
                            <td>
                                <Link href={`/product/${product.id}`}>
                                    <img src={product.image} alt={product.name} width="50" height="50" />
                                </Link>
                            </td>
                            <td>{product.status}</td>
                            <td>
                                <Link href={`/detail/${product.id}`} style={{ textDecoration: "none" }}>{product.name}</Link>
                            </td>
                            <td>{product.price}</td>
                            <td>{product.lastModified.toLocaleDateString()}</td>
                        </tr>
                    ))}
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
    );
}

export default Page;
