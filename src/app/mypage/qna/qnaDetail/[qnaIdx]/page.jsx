'use client'
import MyPageList from '@/app/mypage/MyPageList';
import { Box, Button, Divider, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useAuthStore from '../../../../../../store/authStore';

function Page({ params }) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const LOCAL_IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const [qnaDetail, setQnaDetail] = useState([]);

    const { isAuthenticated, isExpired, user } = useAuthStore();

    useEffect(() => {
        if (!user) return
        console.log('유저 로그인 확인')
        if (!isAuthenticated || isExpired()) {
            alert("로그인이 필요한 서비스입니다.");
            router.push("/user/login"); // Redirect to login page
            return
        }

        const getQnaDetail = async () => {
            setLoading(true);
            const param = await Promise.resolve(params);
            const id = param.qnaIdx;

            axios.get(`${LOCAL_API_BASE_URL}/add/qna/getQnaDetail?qnaIdx=${id}`)
                .then(res => {
                    if (res.data.success) {
                        console.log(res.data)
                        setQnaDetail(res.data.data);
                    }
                })
                .catch(err => {
                    console.log(err)
                    setError('Failed to load page')
                })
                .finally(() => setLoading(false))
        };
        getQnaDetail();
    }, [params])


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
                <Box
                    sx={{
                        maxWidth: 800,
                        margin: '0 auto',
                        padding: 2,
                        border: '1px solid #ddd',
                        borderRadius: 2
                    }}
                >
                    {/* QNA 제목 */}
                    <Typography variant="h5" fontWeight="bold" mb={2} >
                        {qnaDetail.qnaSubject}
                    </Typography>

                    {/* QNA 등록일 */}
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        등록 : {qnaDetail.qnaRegDate}
                    </Typography>


                    {
                        qnaDetail.qnaFile && qnaDetail.qnaFile.length > 0 &&
                        <>
                            {/* 첨부 파일 */}
                            <Typography variant="body2" color="text.secondary" mb={1}>
                                첨부 파일
                            </Typography>
                            <img
                                src={`${LOCAL_IMG_URL}/qna/${qnaDetail.qnaFile}`}
                                style={{ marginBottom: "20px" }} />
                        </>
                    }


                    {/* QNA 내용 */}
                    <pre>
                        {qnaDetail.qnaContent}
                    </pre>
                    <hr />

                    {/* QNA 답변 */}
                    {qnaDetail.qnaStatus === '답변완료' &&
                        <Box backgroundColor="#CEF4E2" p={2} mt={2}>
                            {/* 답변 제목 */}
                            <Typography variant="h5" fontWeight="bold" mb={2} >
                                {qnaDetail.qnaReSubject}
                            </Typography>

                            {/* 답변 등록일 */}
                            <Typography variant="body2" color="text.secondary" mb={1}>
                                답변 등록 : {qnaDetail.qnaReRegDate}
                            </Typography>

                            {/* 답변 내용 */}
                            <pre>
                                {qnaDetail.qnaReContent}
                            </pre>
                        </Box>}

                    <Divider sx={{ my: 2 }} />



                    {/* Back to Qna Button */}
                    <Box textAlign="center">
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ width: 120, height: 40 }}
                            onClick={() => router.push('/mypage/qna')}
                        >
                            목록
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Page;