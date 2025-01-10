'use client'
import React, { useEffect, useState } from 'react';
import { AddSideBar } from '../../../../components/add/notice/AddSideBar';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, TextField, Button } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';

function Page() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
    const [notices, setNotices] = useState([]);
    const [noticesLv1, setNoticesLv1] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalNoticeCount, setTotalNoticeCount] = useState(1)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getNotice();
    }, [currentPage])

    const getNotice = () => {
        setLoading(true);
        axios.get(`${LOCAL_API_BASE_URL}/add/notice/getNotice?currentPage=${currentPage}&searchKeyword=${searchKeyword}`)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data)
                    setNotices(res.data.data.noticeList)
                    setNoticesLv1(res.data.data.noticeListLv1)
                    setTotalNoticeCount(res.data.data.totalNoticeCount)
                }
            })
            .catch(err => {
                console.log(err)
                setError('Failed to load page')
            })
            .finally(() => setLoading(false))
    };

    const handleSearch = (e) => setSearchKeyword(e.target.value);
    const handlePageChange = (event, value) => setCurrentPage(value);


    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
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
        <Box display="flex" style={{ marginTop: '100px' }}>

            <AddSideBar />
            <Box flexGrow={1} p={2}>
                <Box>
                    <TextField
                        variant="outlined"
                        placeholder="검색어를 입력하세요..."
                        value={searchKeyword}
                        onChange={handleSearch}
                        sx={{ mb: 2 }}
                    />
                    <Button variant='contained' onClick={getNotice}>검색</Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>제목</TableCell>
                                <TableCell align="right">작성일자</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {noticesLv1.map((notice1, index) => (
                                <TableRow key={index} className='Mui-selected' >
                                    <TableCell>
                                        <Link href={`/add/noticeDetail/${notice1.noticeIdx}`}
                                            style={{ textDecorationLine: 'none', fontWeight: 'bold' }}>
                                            {notice1.noticeSubject}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">{notice1.noticeReg.slice(0, 10)}</TableCell>
                                </TableRow>
                            ))}
                            {notices.length > 0 ?
                                notices.map((notice, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>
                                            <Link href={`/add/noticeDetail/${notice.noticeIdx}`}
                                                style={{ textDecorationLine: 'none' }}>
                                                {notice.noticeSubject}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right">{notice.noticeReg.slice(0, 10)}</TableCell>
                                    </TableRow>
                                ))
                                :
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        검색하신 결과가 없습니다
                                    </TableCell>
                                </TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination
                    count={totalNoticeCount ? totalNoticeCount : 1}
                    defaultPage={3}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{ mt: 2 }}
                />
            </Box>
        </Box>
    );
}

export default Page;
