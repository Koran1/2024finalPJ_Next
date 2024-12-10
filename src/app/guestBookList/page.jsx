"use client"

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import './guestBookList.css';
import useAuthStore from '../../../store/authStore';

function Page(props) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    // const API_URL = "http://localhost:8080/api/guestbook/list";
    const API_URL = `${LOCAL_API_BASE_URL}/guestbook/list`;
    const {isAuthenticated} = useAuthStore();

    // 데이터 가져오기
    const getData = async () => {
        try {
            setLoading(true); // 데이터를 가져오기 전에 로딩 상태를 true로 설정
            const response = await axios.get(API_URL); // axios로 API를 호출하여 데이터를 가져옴
            // API 응답에서 데이터를 추출합니다.
            // response.data는 서버에서 반환된 전체 응답 객체입니다.
            // response.data.data는 실제 방명록 목록 데이터가 담긴 배열입니다.
            // 이 데이터는 방명록의 이름, 제목 등의 정보를 포함하고 있습니다.
            const data = response.data.data;
            setList(data); // 가져온 데이터를 list state에 저장
        } catch (err) {
            console.error("Error fetching data:", err); // 에러 발생 시 콘솔에 에러 출력
            setError(err.message); // 에러 메시지를 error state에 저장
        } finally {
            setLoading(false); // 성공/실패 여부와 관계없이 로딩 상태를 false로 설정
        }
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
        <>
            <h2 className="title" style={{ textAlign:"center" }}>GuestBookList</h2>
            {/* 로그인 된 상태이면 쓰기 버튼 표시 */}
            {isAuthenticated && (
                <div style={{ textAlign: "right", marginRight: "250px" }}>
                    <Button variant="contained" color="primary">
                        <Link href="/guestBookWrite" style={{ color: "white", textDecoration: "none" }}>쓰기</Link>
                    </Button>
                </div>
            )}
            <TableContainer component={Paper} className="table-container">
                <Table className="custom-table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-header">이름</TableCell>
                            <TableCell className="table-header">제목</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(!list || list.length === 0) ?
                            <TableRow>
                                <TableCell colSpan={2} style={{ textAlign: "center" }}>
                                    <h3>등록된 정보가 존재하지 않습니다.</h3>
                                </TableCell>
                            </TableRow>
                            : list.map((item) => (
                                <TableRow key={item.gb_idx}>
                                    <TableCell className="table-cell">{item.gb_name}</TableCell>
                                    <TableCell className="table-cell">
                                        <Link href={`/guestBookDetails/${item.gb_idx}`}>{item.gb_subject}</Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default Page;