"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./rating.css";
import axios from "axios";
import useAuthStore from "../../../../store/authStore";
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

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
    const { user } = useAuthStore();

    // 평가 정보 가져오기
    useEffect(() => {
        if (!user) return;
        axios.get(`${LOCAL_API_BASE_URL}/deal/rating?userIdx=${user.userIdx}`)
            .then((res) => {
                console.log(res.data);
                setUserRating(res.data.data.rating);
                setRatings(res.data.data.ratingList);
            })
            .catch((err) => console.log(err));
    }, [user]);

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

            <hr />
            <div className="rating-info">
                <Box>
                    <Box>
                        <Box className="user-rats">
                            사용자 평점 : {userRating}
                        </Box>
                        <div className="r-count"> 평점 {ratings.length}개</div>
                    </Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>구매 상품</TableCell>
                                <TableCell>구매자</TableCell>
                                <TableCell>평가 내용</TableCell>
                                <TableCell>평가 점수</TableCell>
                                <TableCell>평가 등록일</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ratings.length > 0 ?
                                ratings.map((rating) => (
                                    <TableRow key={rating.dealSatisSellerIdx}>
                                        <TableCell>
                                            <Link href={`/deal/detail/${rating.dealSatis01}`}>
                                                <img src={`${LOCAL_IMG_URL}/deal/${rating.dealSatis02}`} alt="img"
                                                    width="150px" height="150px" />
                                            </Link>
                                        </TableCell>
                                        <TableCell>{rating.dealSatisBuyerNick}</TableCell>
                                        <TableCell>{rating.dealSatisBuyerContent}</TableCell>
                                        <TableCell>{rating.dealSatisSellerScore}</TableCell>
                                        <TableCell>{rating.dealSatisBuyerRegDate}</TableCell>
                                    </TableRow>
                                ))
                                :
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        판매한 상품이 없습니다.
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>


                </Box>
            </div>
        </div>
    );
}

export default Page;
