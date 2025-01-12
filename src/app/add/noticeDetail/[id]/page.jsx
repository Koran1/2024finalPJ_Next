'use client'
import { Box, Button, Divider, Typography } from '@mui/material';
import { AddSideBar } from '../../../../../components/add/notice/AddSideBar';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import './notice.css'

function Page({ params }) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
    const IMG_URL = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;
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
                        const notices = res.data.data;
                        if (notices.length == 1) {
                            setNoticeDetail(notices[0])
                        } else {
                            setNoticePrev(notices[0])
                            setNoticeDetail(notices[1])
                            setNoticeAfter(notices[2])
                        }

                        // } else if (notices.length == 2) {
                        //     if (notices[0].noticeIdx < notices[1].noticeIdx) {
                        //         setNoticePrev(notices[0])
                        //         setNoticeDetail(notices[1])
                        //     } else {
                        //         setNoticeDetail(notices[0])
                        //         setNoticeAfter(notices[1])
                        //     }
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
        <Box display="flex" style={{ marginTop: '100px' }}>
            <AddSideBar />
            <Box flexGrow={1} p={2} style={{ marginLeft: '25px' }}
                sx={{
                    margin: '0 auto',
                    padding: 2,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                }}
            >
                {/* Title */}
                <Box mb={2} >
                    <div className='notice-title-css'>
                        공지사항
                    </div>
                    <hr />
                    <div className='notice-txt-css'>
                        {/* 제목 , 관리자명 , 날짜 , 시간 */}
                        {noticeDetail.noticeSubject}

                        {/* &nbsp;
                        <span className="nav-divider">|</span>
                        &nbsp;
                        관리자명 */}

                        &nbsp;
                        <span className="nav-divider">|</span>
                        &nbsp;
                        {new Date(noticeDetail.noticeReg).toISOString().split('T')[0]}

                    </div>
                </Box>

                <Divider sx={{ my: 2 }} />
                {/* Attachment Info */}

                {noticeDetail.noticeFile ?
                    <img
                        alt='공지사항 첨부사진'
                        src={`${IMG_URL}/notice/${noticeDetail.noticeFile}`}
                        width="500px"
                        height="500px"
                    />
                    :
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        첨부파일 없음
                    </Typography>
                }

                <pre className='notice-content' variant="body2" color="text.secondary" mb={1}>
                    {noticeDetail.noticeContent === "" ? "공지사항 내용이 없습니다" : noticeDetail.noticeContent}
                </pre>

                {/* <Typography className='notice-content' variant="body2" color="text.secondary" mb={1}>
                    {noticeDetail.noticeContent === "" ? "공지사항 내용이 없습니다" : noticeDetail.noticeContent}
                </Typography> */}
                {/* Notice Content */}
                <pre>
                </pre>

                <hr />
                {/* <Divider sx={{ my: 2 }} /> */}

                {/* Navigation Links */}
                <Box display="flex" flexDirection='column' justifyContent="space-between" mb={2}>
                    {noticeAfter ?
                        <Link className='notice-title-bar' href={`/add/noticeDetail/${noticeAfter.noticeIdx}`} underline="none" color="primary">

                            {/* ⦁ &nbsp;  */}
                            ▲ &nbsp; 다음 글 &nbsp;&nbsp;&nbsp;&nbsp;
                            {noticeAfter.noticeSubject}
                            {/* &nbsp; 오른쪽 끝에 작성일자 */}
                        </Link>
                        : <Typography className='notice-none' variant="body2" color="text.secondary" >다음 글이 없습니다</Typography>}
                    <Divider sx={{ my: 1 }} />

                    <Link className='notice-title-bar' href="#" underline="none" color="primary">
                        〓 &nbsp; 현재 글 &nbsp; &nbsp;&nbsp;&nbsp;{noticeDetail.noticeSubject}
                    </Link>
                    <Divider sx={{ my: 1 }} />
                    {noticePrev ?
                        <Link className='notice-title-bar' href={`/add/noticeDetail/${noticePrev.noticeIdx}`} underline="none" color="primary">
                            ▼ &nbsp; 이전 글  &nbsp;&nbsp;&nbsp;&nbsp; {noticePrev.noticeSubject}
                        </Link>
                        : <Typography variant="body2" color="text.secondary" >이전 글이 없습니다</Typography>
                    }
                    <Divider sx={{ my: 1 }} />
                </Box>
                {/* <hr /> */}

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
        </Box>
    );
}

export default Page;