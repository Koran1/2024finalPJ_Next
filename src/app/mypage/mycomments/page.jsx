'use client'
import { Box, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MyPageList from '../MyPageList';
import { useEffect, useState } from 'react';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';
import Link from 'next/link';

function Page() {
    const [myCmmnts, setMyCmmnts] = useState([{
        logCommentIdx: "",
        logIdx: "",
        logCommentTable: "캠핑로그",
        logTitle: "",
        logCommentContent: "",
        logCommentRegDate: "",
    }]);

    const [currentPage, setCurrentPage] = useState(1);
    const [commentsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const { user } = useAuthStore();
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

    useEffect(() => {
        if (!user) return;
        axios.get(`${LOCAL_API_BASE_URL}/camplog/getMyComments?userIdx=${user.userIdx}`)
            .then((res) => {
                if (res.data.success) {
                    const comments = res.data.data;
                    setMyCmmnts(comments);
                    setTotalPages(Math.ceil(comments.length / commentsPerPage));
                } else {
                    alert(res.data.message);
                }
            })
            .catch((err) => console.log(err));
    }, [user, commentsPerPage]);

    const handlePageChange = (event, value) => setCurrentPage(value);

    const displayedComments = myCmmnts.slice(
        (currentPage - 1) * commentsPerPage,
        currentPage * commentsPerPage
    );

    return (
        <Box display='flex'>
            <MyPageList />
            <Box flexGrow={1} p={2} m={1}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>게시판</TableCell>
                                <TableCell align='center'>게시글</TableCell>
                                <TableCell align='center' sx={{ maxWidth: "500px" }}>댓글 내용</TableCell>
                                <TableCell align='center'>작성일자</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedComments.length > 0 ? (
                                displayedComments.map((cmmt, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell align='center'>캠핑로그</TableCell>
                                        <TableCell align='center'>
                                            <Link href={`/camplog/detail/${cmmt.logIdx}`} style={{ textDecorationLine: 'none' }}>
                                                {cmmt.logTitle}
                                            </Link>
                                        </TableCell>
                                        <TableCell align='center' sx={{ maxWidth: "500px" }}>{cmmt.logCommentContent}</TableCell>
                                        <TableCell align='center'>{cmmt.logCommentRegDate}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        검색하신 결과가 없습니다
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{ mt: 2 }}
                />
            </Box>
        </Box>
    );
}

export default Page;
