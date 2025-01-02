'use client'
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MyPageList from '../MyPageList';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';
import Link from 'next/link';

function Page() {
    // 로그인 확인 절차
    const { user } = useAuthStore();

    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (!user) return

        // QNA 정보 가져오기

        setLoading(true);
        axios.get(`${LOCAL_API_BASE_URL}/add/getQnas?userIdx=${user.userIdx}`)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data)
                    setUserQna(res.data.data)
                }
            })
            .catch(err => {
                console.log(err)
                setError('Failed to load page')
            })
            .finally(() => setLoading(false))

    }, [user])

    // QNA 정보 가져오기
    const [userQna, setUserQna] = useState([]);

    // 로딩, 에러 걸기
    if (loading) {
        return <Box display='flex'>
            <MyPageList />
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
        </Box>
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        )
    }

    return (
        <Box display='flex'>
            <MyPageList />
            <Box flexGrow={1} p={2} m={1}>
                <Button variant="contained" color="primary"
                    href="/mypage/qna/qnaWrite">QNA 작성</Button>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: 'lightgray' }}>
                            <TableRow>
                                <TableCell><b>Question 제목</b></TableCell>
                                <TableCell align="center"><b>Question 등록일</b></TableCell>
                                <TableCell align="center"><b>Question 답변 상태</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userQna.length > 0 ?
                                userQna
                                    .sort((a, b) => new Date(b.qnaRegDate) - new Date(a.qnaRegDate))
                                    .map((qna) => (
                                        <TableRow
                                            key={qna.qnaIdx}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                backgroundColor: qna.qnaStatus === '답변완료' ? '#CEF4E2' : ''
                                            }}
                                            hover
                                        >
                                            <TableCell component="th" scope="row">
                                                <Link href={`/mypage/qna/qnaDetail/${qna.qnaIdx}`}>
                                                    {qna.qnaSubject}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="center">{qna.qnaRegDate.substring(0, 10)}</TableCell>
                                            <TableCell align="center">
                                                {qna.qnaStatus}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                :
                                <TableRow>
                                    <TableCell colSpan={3} align="center">등록된 QNA가 없습니다.</TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default Page;