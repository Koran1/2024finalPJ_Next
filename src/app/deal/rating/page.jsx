"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./rating.css";
import axios from "axios";
import useAuthStore from "../../../../store/authStore";
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Rating } from "@mui/material";

// 관심목록 페이지

function Page() {
    // State to track active link
    const [activeLink, setActiveLink] = useState('/deal/rating');

    // Function to determine the active class
    const getActiveClass = (link) => {
        return activeLink === link ? 'active' : '';
    };

    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;

    const [userRating, setUserRating] = useState("");
    const [ratings, setRatings] = useState([]);
    const { user, token } = useAuthStore();

    // 평가 정보 가져오기
    useEffect(() => {
        if (!user) return;
        axios.get(`${LOCAL_API_BASE_URL}/deal/rating?userIdx=${user.userIdx}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res.data);
                setUserRating(res.data.data.rating);
                setRatings(res.data.data.ratingList);
            })
            .catch((err) => console.log(err));
    }, [user]);

    return (
        <div className="rat-pd-reg-container">
            <div className="rat-nav-links">
                <Link href="/deal/management" className={`rat-btn1 ${getActiveClass('/deal/management')}`}>
                    상품관리
                </Link>
                <span className="rat-nav-divider">|</span>
                <Link href="/deal/purchase" className={`rat-btn1 ${getActiveClass('/deal/purchase')}`}>
                    구매내역
                </Link>
                <span className="rat-nav-divider">|</span>
                <Link href="/deal/interest" className={`rat-btn1 ${getActiveClass('/deal/interest')}`}>
                    관심목록
                </Link>
                <span className="rat-nav-divider">|</span>
                <Link href="/deal/rating" className={`rat-btn1 ${getActiveClass('/deal/rating')}`}>
                    나의평점
                </Link>
                <span className="rat-nav-divider">|</span>
                <Link href="/deal/message" className={`rat-btn1 ${getActiveClass('/deal/message')}`}>
                    채팅목록
                </Link>
            </div>
            <hr />
            <div className="rat-rating-info">
                <div className="rat-rating-title-container">
                    <div className="rat-rating-title">나의 평점</div>
                    <div className="rat-rating-score">
                        <Rating
                            name="read-only"
                            value={Number(userRating) || 0}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{
                                '& .MuiRating-iconFilled': {
                                    color: '#FFD700 !important'
                                },
                                '& .MuiRating-iconEmpty': {
                                    color: '#C0C0C0 !important'
                                }
                            }}
                        />
                        <span>{userRating ? Number(userRating).toFixed(1) : '0.0'}</span>
                    </div>
                </div>
                <div className="rat-r-count">평가 {ratings.length}개</div>
            </div>
            <table className="rat-product-table">
                <thead>
                    <tr>
                        <th>구매 상품</th>
                        <th>구매자</th>
                        <th>평가 내용</th>
                        <th>평가 점수</th>
                        <th>평가 등록일</th>
                    </tr>
                </thead>
                <tbody>
                    {ratings.length > 0 ? (
                        ratings.map((rating) => (
                            <tr key={rating.dealSatisSellerIdx}>
                                <td>
                                    <Link href={`/deal/detail/${rating.dealSatis01}`}>
                                        <img src={`${LOCAL_IMG_URL}/deal/${rating.dealSatis02}`} 
                                            alt="img"
                                            width="150px" 
                                            height="150px" 
                                        />
                                    </Link>
                                </td>
                                <td>{rating.dealSatisBuyerNick}</td>
                                <td>{rating.dealSatisBuyerContent}</td>
                                <td>
                                    <Rating
                                        value={Number(rating.dealSatisSellerScore) || 0}
                                        precision={0.5}
                                        readOnly
                                        size="small"
                                        sx={{
                                            '& .MuiRating-iconFilled': {
                                                color: '#FFD700 !important'
                                            },
                                            '& .MuiRating-iconEmpty': {
                                                color: '#C0C0C0 !important'
                                            }
                                        }}
                                    />
                                    <span style={{ marginLeft: '5px' }}>
                                        {Number(rating.dealSatisSellerScore).toFixed(1)}
                                    </span>
                                </td>
                                <td>{rating.dealSatisBuyerRegDate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>
                                판매한 상품이 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Page;
