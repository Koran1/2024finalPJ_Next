'use client'
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MyPageList from '../MyPageList';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../../../store/authStore';

function Page() {
    // 로그인 확인 절차
    const router = useRouter();
    const { isAuthenticated, isExpired, user } = useAuthStore();

    useEffect(() => {
        if (!user) return
        console.log('유저 로그인 확인')
        if (!isAuthenticated || isExpired()) {
            alert("로그인이 필요한 서비스입니다.");
            router.push("/user/login"); // Redirect to login page
            return
        }

    }, [user])

    // QNA 정보 가져오기
    const [userQna, setUserQna] = useState([]);

    return (
        <Box display='flex'>
            <MyPageList />
            <Box flexGrow={1} p={2} m={1} sx={{ border: '1px solid black' }}>
                <h1>Here is qna page</h1>
            </Box>
        </Box>
    );
}

export default Page;