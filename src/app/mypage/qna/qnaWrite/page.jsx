'use client'
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import { useState } from 'react';
import MyPageList from '../../MyPageList';
import useAuthStore from '../../../../../store/authStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';

function Page() {

    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const { user, token } = useAuthStore();
    const router = useRouter();

    const initQna = {
        qnaSubject: "",
        qnaContent: "",
        qnaMultipartFile: "",
        userIdx: ""
    }

    const [qnavo, setQnavo] = useState(initQna);


    const handleQnavo = (e) => {
        const { name, value } = e.target;
        setQnavo({
            ...qnavo,
            [name]: value
        })
    }

    const handleMultipartFile = (e) => {
        setQnavo({
            ...qnavo,
            qnaMultipartFile: e.target.files[0]
        })
    }
    const emptyCheck = (!qnavo.qnaSubject || !qnavo.qnaContent)

    const handleSubmit = () => {
        if (!user) return;
        console.log(qnavo);
        qnavo.userIdx = user.userIdx;
        if (confirm("질문을 등록하시겠습니까?")) {
            axios.post(`${LOCAL_API_BASE_URL}/add/writeQna`, qnavo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((res) => {
                    console.log(res.data);
                    if (res.data.success) {
                        alert("질문이 정상적으로 등록되었습니다!");
                        router.push('/mypage/qna');
                    } else {
                        alert("질문 등록에 실패했습니다!");
                    }

                })
                .catch((err) => console.log(err));

        }
    }

    return (
        <Box display='flex'>
            <MyPageList />
            <Box flexGrow={1} p={2} m={1}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell>제목</TableCell>
                                <TableCell align="left">
                                    <TextField type='text' name='qnaSubject'
                                        value={qnavo.qnaSubject}
                                        onChange={handleQnavo} />
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>닉네임</TableCell>
                                <TableCell align="left">
                                    {user && user.nickname}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>파일 첨부</TableCell>
                                <TableCell>
                                    <input type='file' name='qnaMultipartFile'
                                        onChange={handleMultipartFile}
                                    />
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>내용</TableCell>
                                <TableCell align="left">
                                    <TextField type='text' name='qnaContent'
                                        value={qnavo.qnaContent}
                                        onChange={handleQnavo}
                                        multiline
                                        sx={{ width: '100%' }}
                                        rows={10} />
                                </TableCell>
                            </TableRow>


                        </TableBody>
                    </Table>
                </TableContainer>

                {/* 제출 & 취소 버튼 */}
                <Box
                    textAlign="center">
                    <Button sx={{ margin: '20px' }}
                        variant="contained" color="primary"
                        disabled={emptyCheck}
                        onClick={handleSubmit}>제출
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => router.push('/mypage/qna')}
                    >
                        목록
                    </Button>
                </Box>

            </Box>

        </Box>
    );
}

export default Page;