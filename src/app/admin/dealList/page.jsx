"use client"
import React, { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AdminList from '../AdminList';
import dynamic from 'next/dynamic';
import axios from 'axios';
import './dealList.css';
import Link from 'next/link';

// CurrentTime을 dynamic import로 변경하고 suspense 비활성화
const CurrentTime = dynamic(() => import('../CurrentTime'), {
    ssr: false,
    suspense: false
});

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
    const [deals, setDeals] = useState([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 거래 목록 조회
    useEffect(() => {
        fetchDeals();
    }, []);

    // 거래 목록 조회
    const fetchDeals = async () => {
        try {
            const response = await axios.get(`${LOCAL_API_BASE_URL}/admin/dealList`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("API 응답:", response);
            
            if (response.data.success) {
                setDeals(response.data.data);
                console.log("거래 목록 데이터:", response.data.data);
            }
        } catch (error) {
            console.error("거래 목록 조회 에러:", error);
        }
    };

    // handleStatusChange 함수 수정
    const handleStatusChange = async (dealIdx, currentStatus) => {
        try {
            // currentStatus가 1이면 0으로, 0이면 1로 변경
            const newStatus = currentStatus === 1 ? 0 : 1;
            
            const response = await axios.put(`${LOCAL_API_BASE_URL}/admin/dealList/${dealIdx}`, {
                dealview: newStatus
            });
            
            if (response.data.success) {
                // 성공 메시지 표시
                alert(newStatus === 0 ? '상품이 비활성화되었습니다.' : '상품이 활성화되었습니다.');
                
                // 목록 새로고침
                fetchDeals();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("상태 변경 실패:", error);
            alert('상태 변경에 실패했습니다.');
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <AdminList />
            <div style={{ flex: 1, position: 'relative' }}>
                {mounted && <CurrentTime />}
                <div className="deal-list-container">
                    <h2>캠핑마켓 관리</h2>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>상품이미지</TableCell>
                                    <TableCell>판매자</TableCell>
                                    <TableCell>구매자</TableCell>
                                    <TableCell>상품명</TableCell>
                                    <TableCell>상품상태</TableCell>
                                    <TableCell>카테고리</TableCell>
                                    <TableCell>상품등록일</TableCell>
                                    <TableCell>Active</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deals.map((deal) => (
                                    <TableRow key={deal.dealIdx}>
                                        <TableCell>
                                            <Link href={`/admin/dealList/dealDetail/${deal.dealIdx}`}>
                                                <img 
                                                    src={deal.deal01 === 'noimg' 
                                                        ? '/default-product-image.jpg'
                                                        : `${LOCAL_IMG_URL}/deal/${deal.deal01}`
                                                    }
                                                    alt={deal.dealTitle}
                                                    width="70"
                                                    height="70"
                                                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell>{deal.dealSellerNick}</TableCell>
                                        <TableCell>{deal.dealBuyerNick || '-'}</TableCell>
                                        <TableCell>
                                            <Link 
                                                href={`/admin/dealList/dealDetail/${deal.dealIdx}`} 
                                                style={{ 
                                                    textDecoration: "none", 
                                                    color: "inherit",
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                {deal.dealTitle}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{deal.deal02 || '판매중'}</TableCell>
                                        <TableCell>{deal.dealCategory}</TableCell>
                                        <TableCell>{deal.dealRegDate}</TableCell>
                                        <TableCell>
                                            <Button
                                                className={`status-toggle-button ${deal.dealview === 1 ? 'active' : 'inactive'}`}
                                                onClick={() => handleStatusChange(deal.dealIdx, deal.dealview)}
                                                variant="contained"
                                                color={deal.dealview === 1 ? "primary" : "error"}
                                            >
                                                {deal.dealview === 1 ? "Active" : "InActive"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}

export default Page;

