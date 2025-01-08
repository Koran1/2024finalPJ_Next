'use client'
import { Box, Button, Divider, Typography } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Page({ params }) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const [noticeDetail, setNoticeDetail] = useState([]);
    const [noticePrev, setNoticePrev] = useState([]);
    const [noticeAfter, setNoticeAfter] = useState([]);

    useEffect(() => {
        const getNotice = async () => {
            setLoading(true);
            const param = await Promise.resolve(params);
            const id = param.id;
            axios.get(`${LOCAL_API_BASE_URL}/add/notice/getNoticeDetail?noticeIdx=${id}`)
                .then(res => {
                    if (res.data.success) {
                        console.log(res.data)
                        setNoticePrev(res.data.data[0])
                        setNoticeDetail(res.data.data[1])
                        setNoticeAfter(res.data.data[2])
                    }
                })
                .catch(err => {
                    console.log(err)
                    setError('Failed to load page')
                })
                .finally(() => setLoading(false))
        };
        getNotice();
    }, [params])


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
        <Box
            sx={{
                maxWidth: 800,
                margin: '0 auto',
                padding: 2,
                border: '1px solid #ddd',
                borderRadius: 2,
                marginTop: '100px'
            }}
        >
            {/* Title */}
            <Typography variant="h5" fontWeight="bold" mb={2} >
                {noticeDetail.noticeSubject}
            </Typography>

            {/* Attachment Info */}
            <Typography variant="body2" color="text.secondary" mb={1}>
                {noticeDetail.noticeFile}
            </Typography>

            {/* Notice Content */}
            <pre>
                {noticeDetail.noticeContent}
            </pre>


            <Divider sx={{ my: 2 }} />

            {/* Navigation Links */}
            <Box display="flex" flexDirection='column' justifyContent="space-between" mb={2}>
                {noticeAfter ?
                    <Link href={`/add/noticeDetail/${noticeAfter.noticeIdx}`} underline="none" color="primary">
                        ▲ 다음 글  &nbsp;&nbsp;&nbsp;&nbsp; {noticeAfter.noticeSubject}
                    </Link>
                    : <Typography variant="body2" color="text.secondary" >다음 글이 없습니다</Typography>}
                <Link href="#" underline="none" color="primary">
                    〓 현재 글 &nbsp; &nbsp;&nbsp;&nbsp;{noticeDetail.noticeSubject}
                </Link>
                {noticePrev ?
                    <Link href={`/add/noticeDetail/${noticePrev.noticeIdx}`} underline="none" color="primary">
                        ▼ 이전 글  &nbsp;&nbsp;&nbsp;&nbsp; {noticePrev.noticeSubject}
                    </Link>
                    : <Typography variant="body2" color="text.secondary" >이전 글이 없습니다</Typography>
                }
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Back to List Button */}
            <Box textAlign="center">
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: 120, height: 40 }}
                    onClick={() => router.push('/add/notice')}
                >
                    목록
                </Button>
            </Box>
        </Box>
    );
}

export default Page;